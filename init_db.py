import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.getcwd(), 'database.db')

def init_db():
    print(f"Initializing database at: {DB_PATH}")
    
    # Check if the database already exists
    if os.path.exists(DB_PATH):
        print("Database already exists. Removing it to start fresh...")
        os.remove(DB_PATH)

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 1. Create Roles Table (1st Normal Form)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS roles (
            id INTEGER PRIMARY KEY,
            name TEXT UNIQUE NOT NULL
        )
    ''')

    # 2. Create Users Table (3rd Normal Form - dependent on role_id)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            cedula TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role_id INTEGER NOT NULL,
            FOREIGN KEY (role_id) REFERENCES roles (id)
        )
    ''')
    
    print("Tables created successfully.")

    # 3. Insert Default Roles
    roles = [('admin',), ('maestro',)]
    cursor.executemany('INSERT INTO roles (name) VALUES (?)', roles)
    
    # 4. Get the ID for 'admin' role
    cursor.execute('SELECT id FROM roles WHERE name = ?', ('admin',))
    admin_role_id = cursor.fetchone()[0]

    # 5. Insert Default Admin User
    admin_cedula = '11111111'
    admin_name = 'admin'
    admin_username = 'admin'
    admin_password = 'admon123*'
    admin_password_hash = generate_password_hash(admin_password)

    cursor.execute('''
        INSERT INTO users (cedula, name, username, password, role_id)
        VALUES (?, ?, ?, ?, ?)
    ''', (admin_cedula, admin_name, admin_username, admin_password_hash, admin_role_id))

    print(f"Admin user created: username='{admin_username}', password='{admin_password}'")

    conn.commit()
    conn.close()
    print("Database initialization complete.")

if __name__ == '__main__':
    init_db()
