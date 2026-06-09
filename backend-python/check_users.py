"""
Script para verificar usuarios en la base de datos
"""
import sqlite3
import hashlib

DB_PATH = 'ether_sentinel.db'

def hash_password(password):
    """Hashea una contraseña usando SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def check_users():
    """Verifica los usuarios en la base de datos"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    
    print('📋 Usuarios en la base de datos:')
    print('-' * 60)
    
    for user in users:
        print(f'ID: {user["id"]}')
        print(f'Usuario: {user["username"]}')
        print(f'Email: {user["email"]}')
        print(f'Password Hash: {user["password"][:20]}...')
        print('-' * 60)
    
    # Verificar hash de admin123
    test_hash = hash_password('admin123')
    print(f'\n🔑 Hash de "admin123": {test_hash[:20]}...')
    
    # Verificar si coincide
    cursor.execute('SELECT * FROM users WHERE username = ?', ('admin',))
    admin = cursor.fetchone()
    
    if admin:
        if admin['password'] == test_hash:
            print('✅ El hash de admin123 COINCIDE con el de la base de datos')
        else:
            print('❌ El hash de admin123 NO COINCIDE con el de la base de datos')
            print(f'   DB Hash: {admin["password"][:30]}...')
            print(f'   Test Hash: {test_hash[:30]}...')
    
    conn.close()

if __name__ == '__main__':
    check_users()
