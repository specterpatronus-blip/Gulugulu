import sqlite3
import threading
import queue
import time
import logging
import os
import sys

# Add project root
sys.path.append(os.getcwd())

class PipelineManager:
    """
    Modular and thread-safe ingestion pipeline for Gulugulu V2.
    Uses a local queue to process jobs in the background.
    """
    def __init__(self, db_path='database.db', num_workers=2):
        self.db_path = db_path
        self.job_queue = queue.Queue()
        self.num_workers = num_workers
        self.workers = []
        self.is_running = False
        
        self.logger = logging.getLogger("PipelineManager")
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            h = logging.StreamHandler()
            h.setFormatter(logging.Formatter('%(asctime)s [%(levelname)s] %(message)s'))
            self.logger.addHandler(h)

    def start(self):
        """Starts the worker threads."""
        if self.is_running:
            return
        
        self.is_running = True
        for i in range(self.num_workers):
            t = threading.Thread(target=self._worker_loop, name=f"PipelineWorker-{i}", daemon=True)
            t.start()
            self.workers.append(t)
        self.logger.info(f"Pipeline started with {self.num_workers} workers.")

    def stop(self):
        """Stops the workers after they finish current job."""
        self.is_running = False
        self.logger.info("Stopping pipeline...")

    def enqueue_resource(self, resource_id):
        """Adds all standard jobs for a resource to the queue."""
        jobs = ['metadata', 'text', 'thumbnail', 'indexing']
        conn = sqlite3.connect(self.db_path)
        try:
            for jt in jobs:
                conn.execute('''
                    INSERT OR IGNORE INTO pipeline_jobs (resource_id, job_type, status)
                    VALUES (?, ?, 'pending')
                ''', (resource_id, jt))
            conn.commit()
        finally:
            conn.close()
        
        # Trigger reload of pending jobs if needed or just let the worker pick them up
        self.logger.info(f"Enqueued resource {resource_id} for processing.")

    def _worker_loop(self):
        while self.is_running:
            job = self._fetch_next_job()
            if job:
                self._process_job(job)
            else:
                time.sleep(2) # Wait for new jobs

    def _fetch_next_job(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            # Atomic update to mark as processing
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, resource_id, job_type FROM pipeline_jobs 
                WHERE status = 'pending' OR (status = 'failed' AND attempts < 3)
                LIMIT 1
            ''')
            job = cursor.fetchone()
            if job:
                cursor.execute('UPDATE pipeline_jobs SET status = "processing", attempts = attempts + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', (job['id'],))
                conn.commit()
                return dict(job)
            return None
        finally:
            conn.close()

    def _process_job(self, job):
        job_id = job['id']
        res_id = job['resource_id']
        job_type = job['job_type']
        
        self.logger.info(f"Processing Job {job_id}: {job_type} for Resource {res_id}")
        
        try:
            # Implementation of specific jobs will go here
            success = False
            if job_type == 'metadata':
                success = self._run_metadata_job(res_id)
            elif job_type == 'text':
                success = self._run_text_job(res_id)
            elif job_type == 'thumbnail':
                success = self._run_thumbnail_job(res_id)
            elif job_type == 'indexing':
                success = self._run_indexing_job(res_id)
            
            status = 'completed' if success else 'failed'
            error_msg = None if success else "Internal job failure"
            
            self._update_job_status(job_id, status, error_msg)
            
        except Exception as e:
            self.logger.error(f"Error in Job {job_id}: {str(e)}")
            self._update_job_status(job_id, 'failed', str(e))

    def _update_job_status(self, job_id, status, error=None):
        conn = sqlite3.connect(self.db_path)
        try:
            conn.execute('''
                UPDATE pipeline_jobs 
                SET status = ?, last_error = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?
            ''', (status, error, job_id))
            conn.commit()
        finally:
            conn.close()

    # Real implementations for specific jobs
    def _run_metadata_job(self, res_id):
        from core.pipeline.extractors.base_extractors import VideoExtractor
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            res = conn.execute('SELECT r.*, ft.category FROM resources r JOIN file_types ft ON r.file_type_id = ft.id WHERE r.id = ?', (res_id,)).fetchone()
            if not res: return False

            full_path = os.path.join('storage', res['internal_path'])
            metadata = {}

            if res['category'] == 'video':
                ve = VideoExtractor()
                metadata = ve.extract_metadata(full_path)

            import json
            conn.execute('''
                INSERT INTO resource_analysis (resource_id, metadata_json)
                VALUES (?, ?)
                ON CONFLICT(resource_id) DO UPDATE SET metadata_json = excluded.metadata_json
            ''', (res_id, json.dumps(metadata)))
            conn.commit()
            return True
        except Exception as e:
            self.logger.error(f"Metadata Job failed: {e}")
            return False
        finally:
            conn.close()

    def _run_text_job(self, res_id):
        from core.pipeline.extractors.base_extractors import PDFExtractor, ImageExtractor
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            res = conn.execute('SELECT r.*, ft.category, ft.extension FROM resources r JOIN file_types ft ON r.file_type_id = ft.id WHERE r.id = ?', (res_id,)).fetchone()
            if not res: return False

            full_path = os.path.join('storage', res['internal_path'])
            text = ""

            if res['extension'] == 'pdf':
                pe = PDFExtractor()
                text = pe.extract_text(full_path)
            elif res['category'] == 'image':
                ie = ImageExtractor()
                text = ie.extract_ocr(full_path)

            conn.execute('''
                INSERT INTO resource_analysis (resource_id, full_text)
                VALUES (?, ?)
                ON CONFLICT(resource_id) DO UPDATE SET full_text = excluded.full_text
            ''', (res_id, text))
            conn.commit()
            return True
        except Exception as e:
            self.logger.error(f"Text Job failed: {e}")
            return False
        finally:
            conn.close()

    def _run_thumbnail_job(self, res_id):
        from core.pipeline.extractors.base_extractors import VideoExtractor, ImageExtractor, PDFExtractor
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            res = conn.execute('SELECT r.*, ft.category, ft.extension FROM resources r JOIN file_types ft ON r.file_type_id = ft.id WHERE r.id = ?', (res_id,)).fetchone()
            if not res: return False

            full_path = os.path.join('storage', res['internal_path'])
            thumb_name = f"{res['uuid']}.webp"
            thumb_rel_path = f"thumbnails/{thumb_name}"
            thumb_dest = os.path.join('storage', thumb_rel_path)

            success = False
            if res['category'] == 'video':
                ve = VideoExtractor()
                success = ve.create_thumbnail(full_path, thumb_dest)
            elif res['category'] == 'image':
                ie = ImageExtractor()
                success = ie.create_thumbnail(full_path, thumb_dest)
            elif res['extension'] == 'pdf':
                pe = PDFExtractor()
                # PDFs will save as png/webp depending on imencode but here fitz saves directly
                # Let's use .webp for consistency if possible, or just .jpg
                success = pe.create_thumbnail(full_path, thumb_dest)

            if success:
                conn.execute('''
                    INSERT INTO resource_thumbnails (resource_id, thumbnail_path, size_type)
                    VALUES (?, ?, 'medium')
                    ON CONFLICT(resource_id) DO UPDATE SET thumbnail_path = excluded.thumbnail_path
                ''', (res_id, thumb_rel_path))
                conn.commit()
            return success

        except Exception as e:
            self.logger.error(f"Thumbnail Job failed: {e}")
            return False
        finally:
            conn.close()

    def _run_indexing_job(self, res_id):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        try:
            data = conn.execute('''
                SELECT lo.id as lo_id, lo.title, lo.description, s.name as subject_name, ra.full_text
                FROM resources r
                JOIN learning_objects lo ON r.lo_id = lo.id
                LEFT JOIN subjects s ON lo.subject_id = s.id
                LEFT JOIN resource_analysis ra ON r.id = ra.resource_id
                WHERE r.id = ?
            ''', (res_id,)).fetchone()

            if not data: return False

            # Update FTS5 Index
            conn.execute('DELETE FROM search_index WHERE lo_id = ?', (data['lo_id'],))
            conn.execute('''
                INSERT INTO search_index (lo_id, title, description, subject_name, content)
                VALUES (?, ?, ?, ?, ?)
            ''', (data['lo_id'], data['title'], data['description'], data['subject_name'], data['full_text']))
            conn.commit()
            return True
        except Exception as e:
            self.logger.error(f"Indexing Job failed: {e}")
            return False
        finally:
            conn.close()
if __name__ == "__main__":
    pm = PipelineManager()
    pm.start()
    # Simple test: enqueue resource 1 if it exists
    pm.enqueue_resource(1)
    time.sleep(10)
    pm.stop()
