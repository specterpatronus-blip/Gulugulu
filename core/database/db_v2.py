import sqlite3
import uuid

DB_PATH = 'database.db'

class DatabaseV2:
    @staticmethod
    def get_connection():
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        return conn

    def get_lo_by_pedagogical_id(self, ped_id):
        conn = self.get_connection()
        try:
            row = conn.execute('''
                SELECT lo.*, s.name as subject_name, g.name as grade_name
                FROM learning_objects lo
                LEFT JOIN subjects s ON lo.subject_id = s.id
                LEFT JOIN grades g ON lo.grade_id = g.id
                WHERE lo.pedagogical_id = ?
            ''', (ped_id,)).fetchone()
            return dict(row) if row else None
        finally:
            conn.close()

    def list_all_learning_objects(self, limit=50):
        conn = self.get_connection()
        try:
            rows = conn.execute('''
                SELECT lo.*, s.name as subject_name, g.name as grade_name
                FROM learning_objects lo
                LEFT JOIN subjects s ON lo.subject_id = s.id
                LEFT JOIN grades g ON lo.grade_id = g.id
                LIMIT ?
            ''', (limit,)).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

    def get_resources_for_lo(self, lo_id):
        conn = self.get_connection()
        try:
            rows = conn.execute('''
                SELECT r.*, ft.extension, ft.category
                FROM resources r
                JOIN file_types ft ON r.file_type_id = ft.id
                WHERE r.lo_id = ?
            ''', (lo_id,)).fetchall()
            return [dict(r) for r in rows]
        finally:
            conn.close()

if __name__ == "__main__":
    db = DatabaseV2()
    los = db.list_all_learning_objects(5)
    print(f"Verified: Found {len(los)} Learning Objects in V2.")
    for lo in los:
        print(f"- {lo['pedagogical_id']}: {lo['title']} ({lo['subject_name']})")
