"""
Script para resetear el usuario admin
"""
import sqlite3
import hashlib

DB_PATH = 'ether_sentinel.db'

def hash_password(password):
    """Hashea una contraseña usando SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def reset_admin():
    """Resetea el usuario admin"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Eliminar usuario admin si existe
    cursor.execute('DELETE FROM users WHERE username = ?', ('admin',))
    
    # Crear nuevo usuario admin
    password_hash = hash_password('admin123')
    cursor.execute(
        'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
        ('admin', password_hash, 'admin@ethersentinel.local')
    )
    
    conn.commit()
    conn.close()
    
    print('✅ Usuario admin reseteado correctamente')
    print('   Usuario: admin')
    print('   Contraseña: admin123')

if __name__ == '__main__':
    reset_admin()
