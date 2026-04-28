from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for, session
import os
import sqlite3
import shutil
import threading
import datetime
import time
from werkzeug.security import generate_password_hash, check_password_hash
from search_engine import SearchEngine
app = Flask(__name__)
app.secret_key = 'explorador_escolar_secret_2024'
BD_PATH = os.path.join(os.getcwd(), 'BD')
BACKUP_DIR = os.path.join(os.getcwd(), 'backups')
if not os.path.exists(BACKUP_DIR):
    os.makedirs(BACKUP_DIR)

DB_PATH = os.path.join(os.getcwd(), 'database.db')

def weekly_backup_task():
    last_backup_date = None
    while True:
        now = datetime.datetime.now()
        if now.weekday() == 6 and last_backup_date != now.date():
            timestamp = now.strftime('%Y%m%d_%H%M%S')
            # DB Backup
            backup_db = f"backup_auto_{timestamp}.db"
            if os.path.exists(DB_PATH):
                shutil.copy2(DB_PATH, os.path.join(BACKUP_DIR, backup_db))
            # Files (BD) Backup
            backup_files_base = os.path.join(BACKUP_DIR, f"backup_files_auto_{timestamp}")
            if os.path.exists(BD_PATH):
                shutil.make_archive(backup_files_base, 'zip', BD_PATH)
            
            last_backup_date = now.date()
        time.sleep(3600)

backup_thread = threading.Thread(target=weekly_backup_task, daemon=True)
backup_thread.start()

# Initialize Search Engine
search_engine = SearchEngine(BD_PATH)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def is_db_broken():
    if not os.path.exists(DB_PATH):
        return True
    try:
        conn = get_db_connection()
        conn.execute('SELECT 1 FROM users LIMIT 1')
        conn.close()
        return False
    except Exception:
        return True

@app.errorhandler(sqlite3.Error)
def handle_sqlite_error(e):
    return render_template('db_error.html', error=str(e)), 500

def ensure_file_metadata_table():
    if not is_db_broken():
        conn = get_db_connection()
        try:
            # Create table if not exists
            conn.execute('''
                CREATE TABLE IF NOT EXISTS file_metadata (
                    filename TEXT PRIMARY KEY,
                    uploader_name TEXT NOT NULL,
                    upload_date TEXT NOT NULL,
                    grade TEXT,
                    subject TEXT
                )
            ''')
            
            # Add columns if they don't exist (for existing databases)
            cursor = conn.execute("PRAGMA table_info(file_metadata)")
            columns = [info['name'] for info in cursor.fetchall()]
            
            if 'grade' not in columns:
                conn.execute("ALTER TABLE file_metadata ADD COLUMN grade TEXT")
            if 'subject' not in columns:
                conn.execute("ALTER TABLE file_metadata ADD COLUMN subject TEXT")
                
            conn.commit()
        except sqlite3.Error:
            pass
        finally:
            conn.close()

ensure_file_metadata_table()

def get_file_metadata_map():
    metadata_map = {}
    if not is_db_broken():
        conn = get_db_connection()
        try:
            rows = conn.execute("SELECT filename, uploader_name, upload_date, grade, subject FROM file_metadata").fetchall()
            for r in rows:
                metadata_map[r['filename']] = {
                    'uploader_name': r['uploader_name'],
                    'upload_date': r['upload_date'],
                    'grade': r['grade'] if r['grade'] else '-',
                    'subject': r['subject'] if r['subject'] else '-'
                }
        except Exception:
            pass
        finally:
            conn.close()
    return metadata_map

def get_dashboard_stats(files=None):
    """Calculate statistics for the admin dashboard"""
    if files is None:
        files = search_engine.index
    total_files = len(files)
    total_size = sum(f.get('size', 0) for f in files)

    # Files by type
    files_by_type = {'pdf': 0, 'image': 0, 'video': 0, 'audio': 0}
    for f in files:
        file_type = f.get('type', 'pdf')
        if file_type == 'document' or file_type not in files_by_type:
            file_type = 'pdf'
        files_by_type[file_type] += 1

    # Format total size
    if total_size >= 1024 * 1024 * 1024:
        total_size_formatted = f"{total_size / (1024 * 1024 * 1024):.1f} GB"
    elif total_size >= 1024 * 1024:
        total_size_formatted = f"{total_size / (1024 * 1024):.1f} MB"
    elif total_size >= 1024:
        total_size_formatted = f"{total_size / 1024:.1f} KB"
    else:
        total_size_formatted = f"{total_size} B"

    # Get most active grade
    files_by_grade = {}
    for f in files:
        g = f.get('grade', '-')
        if g and g != '-':
            files_by_grade[g] = files_by_grade.get(g, 0) + 1
    most_active_grade = max(files_by_grade, key=files_by_grade.get) if files_by_grade else '-'

    # Get recent files (last 3) by upload date or fallback
    recent_files = sorted([f for f in files if f.get('upload_date') and f.get('upload_date') != '-'], key=lambda x: x.get('upload_date', ''), reverse=True)[:3]
    if not recent_files:
        recent_files = files[:3]

    # Get users count
    conn = get_db_connection()
    users_count = conn.execute("SELECT COUNT(*) as count FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'maestro'").fetchone()['count']
    conn.close()

    return {
        'total_files': total_files,
        'total_size': total_size_formatted,
        'total_size_bytes': total_size,
        'files_by_type': files_by_type,
        'total_users': users_count,
        'recent_files': recent_files,
        'most_active_grade': most_active_grade
    }

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/minijuegos')
def minijuegos():
    return render_template('minijuegos.html')

@app.route('/juego/<int:grado>/<int:nivel>')
def juego(grado, nivel):
    # Depending on the grade, render the corresponding game engine
    if grado == 1:
        return render_template('juegos/grado1.html', game_id=nivel)
    # Fallback for unconnected grades
    return redirect(url_for('minijuegos'))

@app.route('/search')
def search():
    query = request.args.get('q', '')
    file_filter = request.args.get('filter', 'all')
    grade_filter = request.args.get('grade', 'all')
    subject_filter = request.args.get('subject', 'all')
    
    # If no query but grade or subject filter, get all files
    if not query and (grade_filter != 'all' or subject_filter != 'all'):
        results = search_engine.index
    elif not query:
        return jsonify([])
    else:
        results = search_engine.search(query, file_filter)
    
    # Attach and filter by metadata
    metadata_map = get_file_metadata_map()
    final_results = []
    
    for item in results:
        meta = metadata_map.get(item['name'], {
            'uploader_name': 'Desconocido', 
            'upload_date': '-', 
            'grade': '-', 
            'subject': '-'
        })
        
        # Filter by grade if specified
        if grade_filter != 'all' and meta['grade'] != grade_filter:
            continue
            
        # Filter by subject if specified
        if subject_filter != 'all' and meta['subject'] != subject_filter:
            continue
            
        # Filter by file type if specified (especially for the case without search query)
        if file_filter != 'all':
            if file_filter == 'image' and item['type'] != 'image':
                continue
            elif file_filter == 'video' and item['type'] != 'video':
                continue
            elif file_filter == 'audio' and item['type'] != 'audio':
                continue
            elif file_filter == 'document' and item['type'] not in ['pdf', 'word', 'text', 'presentation', 'spreadsheet']:
                continue
            
        # Combine
        res_item = item.copy()
        res_item.update(meta)
        if 'type_label' not in res_item:
            res_item['type_label'] = search_engine.get_type_label(res_item['type'])
        final_results.append(res_item)
        
    return jsonify(final_results)

@app.route('/results')
def results():
    query = request.args.get('q', '')
    grade = request.args.get('grade', 'all')
    subject = request.args.get('subject', 'all')
    return render_template('results.html', query=query, grade=grade, subject=subject)

@app.route('/autocomplete')
def autocomplete():
    query = request.args.get('q', '').lower().strip()
    if not query or len(query) < 2:
        return jsonify([])
    
    filenames = search_engine.get_all_filenames()
    suggestions = []
    for name in filenames:
        name_normalized = os.path.splitext(name)[0].lower().replace('_', ' ').replace('-', ' ')
        if query in name_normalized or query in name.lower():
            suggestions.append(name)
    return jsonify(suggestions[:8])

@app.route('/files/<path:filename>')
def serve_file(filename):
    return send_from_directory(BD_PATH, filename)

@app.route('/admin')
def admin_login():
    if 'logged_in' in session:
        return redirect(url_for('admin_dashboard'))
    return render_template('admin_login.html')

@app.route('/admin/login', methods=['POST'])
def login():
    username = request.form.get('username', '')
    password = request.form.get('password', '')
    
    conn = get_db_connection()
    user = conn.execute('SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.username = ?', (username,)).fetchone()
    conn.close()

    if user and check_password_hash(user['password'], password):
        session['logged_in'] = True
        session['user_id'] = user['cedula']
        session['username'] = user['username']
        session['role'] = user['role_name']
        session['name'] = user['name']
        return redirect(url_for('admin_dashboard'))
    return render_template('admin_login.html', error="Usuario o contraseña incorrectos")

@app.route('/admin/dashboard')
def admin_dashboard():
    if 'logged_in' not in session:
        return redirect(url_for('admin_login'))

    search_engine.index_files()

    # Fetch maestro users for admin view
    users = []
    if session.get('role') == 'admin':
        conn = get_db_connection()
        users = conn.execute(
            'SELECT u.cedula, u.name, u.username FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = ?',
            ('maestro',)
        ).fetchall()
        conn.close()

    metadata_map = get_file_metadata_map()
    files_with_meta = []
    for f in search_engine.index:
        meta = metadata_map.get(f['name'], {'uploader_name': 'Desconocido', 'upload_date': '-', 'grade': '-', 'subject': '-'})
        f_copy = f.copy()
        f_copy['uploader_name'] = meta['uploader_name']
        f_copy['upload_date'] = meta['upload_date']
        f_copy['grade'] = meta['grade']
        f_copy['subject'] = meta['subject']
        files_with_meta.append(f_copy)

    return render_template('admin_dashboard.html',
                           files=files_with_meta,
                           role=session.get('role'),
                           users=users,
                           stats=get_dashboard_stats(files_with_meta))

@app.route('/admin/upload', methods=['POST'])
def upload_file():
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    files = request.files.getlist('file')
    if not files or (len(files) == 1 and files[0].filename == ''):
        return jsonify({'error': 'No selected files'}), 400
    
    uploaded_filenames = []
    # Receive lists of metadata to match each file
    grades = request.form.getlist('grade')
    subjects = request.form.getlist('subject')
    
    conn = get_db_connection()
    try:
        uploader_name = session.get('name', 'Desconocido')
        now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        for i, file in enumerate(files):
            if file and file.filename:
                # Match metadata by index, fallback to '-'
                g = grades[i] if i < len(grades) else '-'
                s = subjects[i] if i < len(subjects) else '-'
                
                filepath = os.path.join(BD_PATH, file.filename)
                file.save(filepath)
                
                conn.execute('''
                    INSERT OR REPLACE INTO file_metadata (filename, uploader_name, upload_date, grade, subject)
                    VALUES (?, ?, ?, ?, ?)
                ''', (file.filename, uploader_name, now, g, s))
                uploaded_filenames.append(file.filename)
                
        conn.commit()
    except Exception as e:
        return jsonify({'error': f'Error en base de datos: {str(e)}'}), 500
    finally:
        conn.close()
            
    search_engine.index_files()
    return jsonify({'success': True, 'count': len(uploaded_filenames), 'filenames': uploaded_filenames})

@app.route('/admin/delete', methods=['POST'])
def delete_file():
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    filename = request.form.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    try:
        filepath = os.path.join(BD_PATH, filename)
        os.remove(filepath)
        
        conn = get_db_connection()
        try:
            conn.execute("DELETE FROM file_metadata WHERE filename = ?", (filename,))
            conn.commit()
        except Exception:
            pass
        finally:
            conn.close()
            
        search_engine.index_files()
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

@app.route('/admin/create_user', methods=['POST'])
def create_user():
    if 'logged_in' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 401
    
    cedula = request.form.get('cedula')
    name = request.form.get('name')
    username = request.form.get('username')
    password = request.form.get('password')

    if not cedula or not name or not username or not password:
        users = get_db_connection().execute('SELECT u.cedula, u.name, u.username FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = ?', ('maestro',)).fetchall()
        return render_template('admin_dashboard.html', files=search_engine.index, role=session.get('role'), users=users, stats=get_dashboard_stats(), error="Todos los campos son obligatorios")
    
    conn = get_db_connection()
    try:
        # Get 'maestro' role id
        role = conn.execute('SELECT id FROM roles WHERE name = ?', ('maestro',)).fetchone()
        if not role:
            return jsonify({'error': 'Role "maestro" not found'}), 500
            
        password_hash = generate_password_hash(password)
        conn.execute('INSERT INTO users (cedula, name, username, password, role_id) VALUES (?, ?, ?, ?, ?)',
                     (cedula, name, username, password_hash, role['id']))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        users = get_db_connection().execute('SELECT u.cedula, u.name, u.username FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = ?', ('maestro',)).fetchall()
        return render_template('admin_dashboard.html', files=search_engine.index, role=session.get('role'), users=users, stats=get_dashboard_stats(), error="El nombre de usuario ya existe")
    except Exception as e:
        conn.close()
        users = get_db_connection().execute('SELECT u.cedula, u.name, u.username FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = ?', ('maestro',)).fetchall()
        return render_template('admin_dashboard.html', files=search_engine.index, role=session.get('role'), users=users, stats=get_dashboard_stats(), error=str(e))
    
    conn.close()
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/update_user', methods=['POST'])
def update_user():
    if 'logged_in' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 401

    cedula = request.form.get('cedula')
    name = request.form.get('name')
    username = request.form.get('username')
    password = request.form.get('password')

    if not cedula or not name or not username:
        return jsonify({'error': 'Cédula, nombre y usuario son obligatorios'}), 400

    conn = get_db_connection()
    try:
        if password:
            password_hash = generate_password_hash(password)
            conn.execute('UPDATE users SET name = ?, username = ?, password = ? WHERE cedula = ?',
                         (name, username, password_hash, cedula))
        else:
            conn.execute('UPDATE users SET name = ?, username = ? WHERE cedula = ?',
                         (name, username, cedula))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'El nombre de usuario ya existe'}), 409
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

    conn.close()
    return jsonify({'success': True})

@app.route('/admin/delete_user', methods=['POST'])
def delete_user():
    if 'logged_in' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 401

    cedula = request.form.get('cedula')
    if not cedula:
        return jsonify({'error': 'Cédula es obligatoria'}), 400

    conn = get_db_connection()
    try:
        # Ensure we only delete maestro users, never admin
        result = conn.execute(
            'DELETE FROM users WHERE cedula = ? AND role_id = (SELECT id FROM roles WHERE name = ?)',
            (cedula, 'maestro')
        )
        if result.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Usuario no encontrado o no es maestro'}), 404
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({'error': str(e)}), 500

    conn.close()
    return jsonify({'success': True})

@app.route('/admin/backup/create', methods=['POST'])
def create_backup():
    if 'logged_in' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized'}), 401
    
    now = datetime.datetime.now()
    timestamp = now.strftime('%Y%m%d_%H%M%S')
    
    backup_db_name = f"backup_manual_{timestamp}.db"
    backup_db_path = os.path.join(BACKUP_DIR, backup_db_name)
    
    backup_files_name = f"backup_files_manual_{timestamp}"
    backup_files_path = os.path.join(BACKUP_DIR, backup_files_name)
    
    success_db = False
    success_files = False

    if os.path.exists(DB_PATH):
        shutil.copy2(DB_PATH, backup_db_path)
        success_db = True
    
    if os.path.exists(BD_PATH):
        shutil.make_archive(backup_files_path, 'zip', BD_PATH)
        success_files = True

    if success_db or success_files:
        return jsonify({
            'success': True, 
            'filename': backup_db_name, # Para compatibilidad con el frontend actual
            'db_backup': backup_db_name if success_db else None,
            'files_backup': f"{backup_files_name}.zip" if success_files else None
        })
    return jsonify({'error': 'Source files not found'}), 404

@app.route('/admin/backup/list', methods=['GET'])
def list_backups():
    if not is_db_broken():
        if 'logged_in' not in session or session.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 401
    
    backups = []
    if os.path.exists(BACKUP_DIR):
        for f in os.listdir(BACKUP_DIR):
            if f.endswith('.db') or f.endswith('.zip'):
                stat = os.stat(os.path.join(BACKUP_DIR, f))
                date_str = datetime.datetime.fromtimestamp(stat.st_mtime).strftime('%Y-%m-%d %H:%M:%S')
                # Size formatting
                size_mb = f"{stat.st_size / (1024 * 1024):.2f} MB" if stat.st_size >= 1024 * 1024 else f"{stat.st_size / 1024:.2f} KB"
                
                b_type = "Base de Datos" if f.endswith('.db') else "Archivos"
                backups.append({
                    'filename': f, 
                    'date': date_str, 
                    'size': size_mb,
                    'type': b_type
                })
    
    # Sort backwards by date
    backups.sort(key=lambda x: x['date'], reverse=True)
    return jsonify({'success': True, 'backups': backups})

@app.route('/admin/backup/restore', methods=['POST'])
def restore_backup():
    if not is_db_broken():
        if 'logged_in' not in session or session.get('role') != 'admin':
            return jsonify({'error': 'Unauthorized'}), 401
    
    filename = request.form.get('filename')
    if not filename:
        return jsonify({'error': 'No filename provided'}), 400
    
    backup_path = os.path.join(BACKUP_DIR, filename)
    if os.path.exists(backup_path):
        if filename.endswith('.db'):
            shutil.copy2(backup_path, DB_PATH)
        elif filename.endswith('.zip'):
            # Limpiar carpeta BD para una restauración exacta
            for item in os.listdir(BD_PATH):
                item_path = os.path.join(BD_PATH, item)
                if os.path.isfile(item_path):
                    os.remove(item_path)
                elif os.path.isdir(item_path):
                    shutil.rmtree(item_path)
            
            # Extraer el backup
            shutil.unpack_archive(backup_path, BD_PATH, 'zip')
            
            # Actualizar el índice del motor de búsqueda inmediatamente
            search_engine.index_files()
        
        return jsonify({'success': True})
    return jsonify({'error': 'Backup not found'}), 404

if __name__ == '__main__':
    if not os.path.exists(BD_PATH):
        os.makedirs(BD_PATH)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
