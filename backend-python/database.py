"""
Base de datos SQLite para usuarios
"""
import sqlite3
import hashlib
import os

DB_PATH = 'ether_sentinel.db'

def get_db():
    """Obtiene conexión a la base de datos"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializa la base de datos y crea el usuario admin por defecto"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Crear tabla de usuarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Verificar si existe el usuario admin
    cursor.execute('SELECT * FROM users WHERE username = ?', ('admin',))
    if not cursor.fetchone():
        # Crear usuario admin por defecto
        password_hash = hash_password('admin123')
        cursor.execute(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            ('admin', password_hash, 'admin@ethers entinel.local')
        )
        print('✅ Usuario admin creado (admin/admin123)')
    
    conn.commit()
    conn.close()

def hash_password(password):
    """Hashea una contraseña usando SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password, password_hash):
    """Verifica si una contraseña coincide con su hash"""
    return hash_password(password) == password_hash

def create_user(username, password, email=None):
    """Crea un nuevo usuario"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        password_hash = hash_password(password)
        cursor.execute(
            'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
            (username, password_hash, email)
        )
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return {'id': user_id, 'username': username, 'email': email}
    except sqlite3.IntegrityError:
        raise Exception('El usuario ya existe')

def authenticate_user(username, password):
    """Autentica un usuario"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    
    if user and verify_password(password, user['password']):
        return {
            'id': user['id'],
            'username': user['username'],
            'email': user['email']
        }
    return None

def get_user_by_username(username):
    """Obtiene un usuario por su nombre de usuario"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, email, created_at FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()
    return dict(user) if user else None

def get_all_users():
    """Obtiene todos los usuarios (sin contraseñas)"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id, username, email, created_at FROM users')
    users = cursor.fetchall()
    conn.close()
    return [dict(user) for user in users]

def update_password(username, new_password):
    """Actualiza la contraseña de un usuario"""
    conn = get_db()
    cursor = conn.cursor()
    password_hash = hash_password(new_password)
    cursor.execute('UPDATE users SET password = ? WHERE username = ?', (password_hash, username))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0

def delete_user(username):
    """Elimina un usuario"""
    if username == 'admin':
        raise Exception('No se puede eliminar el usuario admin')
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM users WHERE username = ?', (username,))
    conn.commit()
    affected = cursor.rowcount
    conn.close()
    return affected > 0
