import sqlite3
import os

DB_PATH = os.path.join(os.getcwd(), 'database.db')
if os.path.exists(DB_PATH):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        rows = conn.execute("SELECT DISTINCT grade FROM file_metadata").fetchall()
        print("Existing grades in DB:")
        for r in rows:
            print(f"- {r['grade']}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()
else:
    print("DB not found")
