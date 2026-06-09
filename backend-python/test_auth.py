"""
Script para probar la autenticación directamente
"""
from database import authenticate_user

print('🔐 Probando autenticación...\n')

# Probar con admin/admin123
result = authenticate_user('admin', 'admin123')

if result:
    print('✅ Autenticación EXITOSA')
    print(f'   Usuario: {result["username"]}')
    print(f'   ID: {result["id"]}')
    print(f'   Email: {result["email"]}')
else:
    print('❌ Autenticación FALLIDA')
    print('   Las credenciales no son correctas')
