import sqlite3
import uuid
import os
import re

DB_PATH = 'database.db'

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

def bridge_v1_to_v2():
    """
    Temporary bridge that creates Learning Objects and Resources in V2 
    from existing V1 file_metadata.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    print("Bridging V1 data to V2 Foundation...")

    # 1. Get all V1 metadata
    v1_files = cursor.execute("SELECT * FROM file_metadata").fetchall()
    
    # 2. Get Catalogs
    subjects = {row['name']: row['id'] for row in cursor.execute("SELECT id, name FROM subjects").fetchall()}
    grades = {row['level']: row['id'] for row in cursor.execute("SELECT id, level FROM grades").fetchall()}
    file_types = {row['extension']: row['id'] for row in cursor.execute("SELECT id, extension FROM file_types").fetchall()}

    for file in v1_files:
        filename = file['filename']
        uploader = file['uploader_name']
        upload_date = file['upload_date']
        grade_val = file['grade']
        subject_val = file['subject']

        # Determine subject_id and grade_id
        # Simple heuristic mapping for V1 compatibility
        s_id = subjects.get(subject_val)
        
        # Try to parse grade level from string like '1°' or 'Primero'
        g_level = None
        if '1' in grade_val or 'primero' in grade_val.lower(): g_level = 1
        elif '2' in grade_val or 'segundo' in grade_val.lower(): g_level = 2
        elif '3' in grade_val or 'tercero' in grade_val.lower(): g_level = 3
        elif '4' in grade_val or 'cuarto' in grade_val.lower(): g_level = 4
        elif '5' in grade_val or 'quinto' in grade_val.lower(): g_level = 5
        
        g_id = grades.get(g_level)

        # Create Learning Object
        lo_uuid = str(uuid.uuid4())
        title = os.path.splitext(filename)[0].replace('_', ' ').replace('-', ' ').title()
        lo_slug = slugify(title)
        
        # Generate Pedagogical ID: LO-[SUB]-[GR]-[SEQ]
        sub_code = cursor.execute("SELECT code FROM subjects WHERE id = ?", (s_id,)).fetchone()
        sub_code = sub_code[0] if sub_code else 'GEN'
        ped_id = f"LO-{sub_code}-G{g_level if g_level else 0}-{lo_uuid[:4].upper()}"

        try:
            cursor.execute('''
                INSERT OR IGNORE INTO learning_objects 
                (uuid, pedagogical_id, slug, title, subject_id, grade_id, status)
                VALUES (?, ?, ?, ?, ?, ?, 'published')
            ''', (lo_uuid, ped_id, lo_slug, title, s_id, g_id))
            
            lo_id = cursor.execute("SELECT id FROM learning_objects WHERE uuid = ?", (lo_uuid,)).fetchone()
            if not lo_id:
                # If ignore kicked in, find existing
                lo_id = cursor.execute("SELECT id FROM learning_objects WHERE slug = ?", (lo_slug,)).fetchone()
            
            lo_id = lo_id[0]

            # Create Resource
            res_uuid = str(uuid.uuid4())
            ext = os.path.splitext(filename)[1].lower().replace('.', '')
            ft_id = file_types.get(ext, file_types.get('pdf')) # fallback to pdf
            
            # For Phase 1, internal_path is same as filename for compatibility
            # In Phase 2 this will change to the new naming convention
            cursor.execute('''
                INSERT OR IGNORE INTO resources 
                (lo_id, uuid, internal_path, original_name, file_type_id, file_size, checksum_sha256)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (lo_id, res_uuid, filename, filename, ft_id, 0, f"v1-{filename}")) # Fake checksum for v1

        except Exception as e:
            print(f"Error bridging {filename}: {e}")

    conn.commit()
    conn.close()
    print("Bridge completed. V2 Foundation populated.")

if __name__ == "__main__":
    bridge_v1_to_v2()
