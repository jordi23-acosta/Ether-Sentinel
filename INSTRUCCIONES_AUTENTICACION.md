# 🚀 Instrucciones Rápidas - Sistema de Autenticación

## ✅ ¿Qué se implementó?

Se agregó un sistema completo de **login y registro** con base de datos SQLite local.

## 📝 Pasos para Probar

### 1️⃣ Reiniciar el Backend
Es importante reiniciar el backend para que se cree la base de datos:

```bash
# Si el backend está corriendo, detenerlo (Ctrl+C)
# Luego iniciar de nuevo:
cd backend-python
python app.py
```

Deberías ver este mensaje:
```
✅ Usuario admin creado (admin/admin123)
🚀 Backend corriendo en http://localhost:3001
```

### 2️⃣ Iniciar el Frontend
En otra terminal:

```bash
npm run dev
```

### 3️⃣ Probar el Login
1. Abrir `http://localhost:5173`
2. Usar las credenciales:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`
3. Hacer clic en "Iniciar Sesión"
4. Deberías ser redirigido al Dashboard

### 4️⃣ Probar el Registro
1. En la página de login, hacer clic en "Regístrate aquí"
2. Completar el formulario:
   - Usuario: `prueba`
   - Contraseña: `prueba123`
   - Confirmar contraseña: `prueba123`
   - Email (opcional): `prueba@test.com`
3. Hacer clic en "Crear Cuenta"
4. Deberías ver un mensaje de éxito
5. Iniciar sesión con las nuevas credenciales

### 5️⃣ Probar Cerrar Sesión
1. Una vez dentro del Dashboard
2. En el Sidebar (menú lateral), hacer clic en "Cerrar Sesión"
3. Deberías ser redirigido al Login

### 6️⃣ Probar Protección de Rutas
1. Cerrar sesión
2. Intentar acceder directamente a `http://localhost:5173/dashboard`
3. Deberías ser redirigido automáticamente al Login

## 🎯 Funcionalidades Implementadas

✅ Login con usuario y contraseña  
✅ Registro de nuevos usuarios  
✅ Cerrar sesión  
✅ Protección de rutas (no se puede acceder sin login)  
✅ Usuario admin creado automáticamente  
✅ Contraseñas encriptadas (SHA-256)  
✅ Sesiones persistentes con cookies  
✅ Validación de formularios  
✅ Mensajes de error claros  

## 📂 Base de Datos

La base de datos se crea automáticamente en:
```
backend-python/ether_sentinel.db
```

Puedes verificar que existe después de iniciar el backend.

## 🔍 Verificar que Funciona

### Verificar Backend
```bash
curl http://localhost:3001/health
```

Debería responder con el estado del servidor.

### Verificar Login (desde terminal)
```bash
curl -X POST http://localhost:3001/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
```

Debería responder con `{"success": true, "user": {...}}`

## ❌ Problemas Comunes

### "Error al iniciar sesión"
- Verificar que el backend esté corriendo
- Verificar las credenciales (admin/admin123)
- Revisar la consola del backend para errores

### "No se puede conectar"
- Verificar que el backend esté en puerto 3001
- Verificar que el frontend esté en puerto 5173
- Verificar que no haya firewall bloqueando

### "El usuario ya existe"
- El nombre de usuario ya está registrado
- Usar un nombre diferente o iniciar sesión

## 🎉 ¡Listo!

El sistema de autenticación está completamente funcional. Ahora cada instalación de Ether Sentinel tendrá su propia base de datos local con usuarios independientes.

## 📞 Siguiente Paso

Una vez que verifiques que todo funciona, puedes:
1. Cambiar la contraseña del admin
2. Crear usuarios adicionales
3. Distribuir el proyecto a otros usuarios
4. Cada instalación tendrá su propia base de datos
