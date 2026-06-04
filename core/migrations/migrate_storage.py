import sqlite3
import os
import sys
import logging

# Add project root to path to import StorageManager
sys.path.append(os.getcwd())

from core.storage_manager import StorageManager

DB_PATH = 'database.db'
V1_DIR = 'BD'

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def slugify(text):
    import re
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

def migrate_storage():
    """
    Phase 2 Migration Script:
    Migrates files from BD/ to storage/ using the new StorageManager.
    Updates the 'resources' table with actual paths and hashes.
    """
    if not os.path.exists(V1_DIR):
        logging.error(f"V1 Directory '{V1_DIR}' not found.")
        return

    sm = StorageManager()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    logging.info("Starting Storage Migration (V1 -> V2)...")

    # Get all resources that haven't been migrated yet (internal_path starts with BD/)
    # Or based on our Bridge script, internal_path is currently just the filename
    v1_resources = cursor.execute('''
        SELECT r.id as res_id, r.internal_path as v1_filename, lo.id as lo_id, 
               lo.subject_id, lo.grade_id, s.code as sub_code, s.name as sub_name,
               g.level as grade_level, ft.category as ft_category
        FROM resources r
        JOIN learning_objects lo ON r.lo_id = lo.id
        LEFT JOIN subjects s ON lo.subject_id = s.id
        LEFT JOIN grades g ON lo.grade_id = g.id
        JOIN file_types ft ON r.file_type_id = ft.id
        WHERE r.checksum_sha256 LIKE 'v1-%'
    ''').fetchall()

    logging.info(f"Found {len(v1_resources)} files to migrate.")

    # Tracking correlatives per subject/grade to generate names
    # In a real scenario, we'd query the max correlative from DB
    correlatives = {}

    migrated_count = 0
    error_count = 0

    for row in v1_resources:
        v1_filename = row['v1_filename']
        v1_path = os.path.join(V1_DIR, v1_filename)

        if not os.path.exists(v1_path):
            logging.warning(f"File not found in BD/: {v1_filename}. Skipping.")
            error_count += 1
            continue

        # Setup correlative
        sub_id = row['subject_id'] or 0
        gr_id = row['grade_id'] or 0
        key = f"{sub_id}-{gr_id}"
        correlatives[key] = correlatives.get(key, 0) + 1
        
        try:
            # Check if file already exists in V2 by Hash (Deduplication)
            current_hash = sm.calculate_sha256(v1_path)
            duplicate = cursor.execute("SELECT internal_path FROM resources WHERE checksum_sha256 = ?", (current_hash,)).fetchone()
            
            if duplicate:
                logging.info(f"Deduplication: {v1_filename} is a duplicate of {duplicate['internal_path']}. Updating metadata.")
                cursor.execute('''
                    UPDATE resources 
                    SET internal_path = ?, checksum_sha256 = ?, file_size = ?
                    WHERE id = ?
                ''', (duplicate['internal_path'], current_hash, os.path.getsize(v1_path), row['res_id']))
                migrated_count += 1
                continue

            # Store in V2
            storage_result = sm.store_file(
                source_path=v1_path,
                category=row['ft_category'],
                subject_code=row['sub_code'] or 'GEN',
                subject_slug=slugify(row['sub_name'] or 'General'),
                grade_level=row['grade_level'] or 0,
                correlative=correlatives[key]
            )

            # Update Resource in DB
            cursor.execute('''
                UPDATE resources 
                SET internal_path = ?, checksum_sha256 = ?, file_size = ?
                WHERE id = ?
            ''', (storage_result['internal_path'], storage_result['sha256'], storage_result['file_size'], row['res_id']))
            
            migrated_count += 1

        except Exception as e:
            logging.error(f"Failed to migrate {v1_filename}: {e}")
            error_count += 1

    conn.commit()
    conn.close()

    logging.info(f"Migration finished. Success: {migrated_count}, Errors: {error_count}")
    logging.info("Original files in 'BD/' were NOT modified.")

if __name__ == "__main__":
    migrate_storage()
