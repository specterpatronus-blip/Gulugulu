import sqlite3
import os
import sys
import time

# Add project root
sys.path.append(os.getcwd())

from core.pipeline.pipeline_manager import PipelineManager

DB_PATH = 'database.db'

def run_bulk_processing():
    """
    Identifies all resources in V2 and enqueued them in the pipeline.
    Useful after Phase 2 migration.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    resources = conn.execute("SELECT id, internal_path FROM resources").fetchall()
    conn.close()

    print(f"Enqueuing {len(resources)} resources for pipeline processing...")
    
    pm = PipelineManager()
    for res in resources:
        pm.enqueue_resource(res['id'])
    
    print("All jobs enqueued. Starting workers...")
    pm.start()
    
    # Wait for completion or timeout
    try:
        while True:
            conn = sqlite3.connect(DB_PATH)
            pending = conn.execute("SELECT COUNT(*) FROM pipeline_jobs WHERE status IN ('pending', 'processing')").fetchone()[0]
            conn.close()
            
            if pending == 0:
                print("Processing complete!")
                break
            
            print(f"Pending jobs: {pending}...")
            time.sleep(5)
    except KeyboardInterrupt:
        print("Stopping workers...")
    finally:
        pm.stop()

if __name__ == "__main__":
    run_bulk_processing()
