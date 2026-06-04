import sqlite3
import os
import uuid
import logging

# Configuration
DB_PATH = 'database.db'
SCHEMA_PATH = 'core/migrations/v2_foundation.sql'

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_migration():
    """
    Applies the V2 Foundation Schema to the existing database.
    This process is additive and does not destroy V1 data.
    """
    if not os.path.exists(DB_PATH):
        logging.error(f"Database {DB_PATH} not found. Please run init_db.py first.")
        return

    logging.info("Starting Phase 1: Foundation Layer Migration...")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # Enable Foreign Keys
        cursor.execute("PRAGMA foreign_keys = ON;")
        
        # Read and execute schema
        with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        
        # Execute scripts (executescript handles multiple statements)
        cursor.executescript(schema_sql)
        
        conn.commit()
        logging.info("V2 Tables created successfully.")
        
        # Verification
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row[0] for row in cursor.fetchall()]
        logging.info(f"Current tables: {', '.join(tables)}")
        
    except Exception as e:
        conn.rollback()
        logging.error(f"Migration failed: {str(e)}")
        raise
    finally:
        conn.close()

if __name__ == "__main__":
    run_migration()
