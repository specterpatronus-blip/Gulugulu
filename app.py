from flask import Flask, render_template, request, jsonify, send_from_directory, redirect, url_for, session
import os
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
from search_engine import SearchEngine
app = Flask(__name__)
app.secret_key = 'explorador_escolar_secret_2024'
BD_PATH = os.path.join(os.getcwd(), 'BD')

DB_PATH = os.path.join(os.getcwd(), 'database.db')

# Initialize Search Engine
search_engine = SearchEngine(BD_PATH)

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def get_dashboard_stats():
    """Calculate statistics for the admin dashboard"""
    files = search_engine.index
    total_files = len(files)
    total_size = sum(f.get('size', 0) for f in files)

    # Files by type
    files_by_type = {'pdf': 0, 'image': 0, 'video': 0, 'audio': 0, 'document': 0}
    for f in files:
        file_type = f.get('type', 'document')
        if file_type in files_by_type:
            files_by_type[file_type] += 1
        else:
            files_by_type['document'] += 1

    # Format total size
    if total_size >= 1024 * 1024 * 1024:
        total_size_formatted = f"{total_size / (1024 * 1024 * 1024):.1f} GB"
    elif total_size >= 1024 * 1024:
        total_size_formatted = f"{total_size / (1024 * 1024):.1f} MB"
    elif total_size >= 1024:
        total_size_formatted = f"{total_size / 1024:.1f} KB"
    else:
        total_size_formatted = f"{total_size} B"

    # Get recent files (last 3)
    recent_files = sorted(files, key=lambda x: x.get('modified', ''), reverse=True)[:3]

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
        'recent_files': recent_files
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
    if not query:
        return jsonify([])
    
    results = search_engine.search(query, file_filter)
    return jsonify(results)

@app.route('/results')
def results():
    query = request.args.get('q', '')
    return render_template('results.html', query=query)

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

    return render_template('admin_dashboard.html',
                           files=search_engine.index,
                           role=session.get('role'),
                           users=users,
                           stats=get_dashboard_stats())

@app.route('/admin/upload', methods=['POST'])
def upload_file():
    if 'logged_in' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        filepath = os.path.join(BD_PATH, file.filename)
        file.save(filepath)
        search_engine.index_files()
        return jsonify({'success': True, 'filename': file.filename})

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

if __name__ == '__main__':
    if not os.path.exists(BD_PATH):
        os.makedirs(BD_PATH)
    
    app.run(debug=True, host='0.0.0.0', port=5000)
