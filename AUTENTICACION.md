# 🔐 Sistema de Autenticación - Ether Sentinel

## ✅ Implementación Completada

Se ha implementado un sistema completo de autenticación con SQLite para Ether Sentinel.

## 📋 Características

### Backend (Python + Flask)
- ✅ Base de datos SQLite local (`ether_sentinel.db`)
- ✅ Tabla de usuarios con contraseñas hasheadas (SHA-256)
- ✅ Usuario admin creado automáticamente al iniciar
- ✅ Endpoints de autenticación:
  - `POST /api/auth/login` - Iniciar sesión
  - `POST /api/auth/register` - Registrar nuevo usuario
  - `POST /api/auth/logout` - Cerrar sesión
  - `GET /api/auth/me` - Obtener usuario actual
  - `GET /api/auth/users` - Listar usuarios (solo admin)
- ✅ Sesiones basadas en cookies (Flask sessions)
- ✅ Contraseñas con mínimo 6 caracteres

### Frontend (React)
- ✅ Página de Login actualizada con API real
- ✅ Página de Registro nueva (`/register`)
- ✅ Protección de rutas (ProtectedRoute)
- ✅ Redirección automática al login si no está autenticado
- ✅ Botón de "Cerrar Sesión" en el Sidebar
- ✅ Manejo de errores y estados de carga
- ✅ Opción "Recordar dispositivo" (localStorage)

## 🚀 Cómo Usar

### 1. Iniciar el Backend
```bash
cd backend-python
python app.py
```

El backend:
- Creará automáticamente la base de datos `ether_sentinel.db`
- Creará el usuario admin por defecto
- Estará disponible en `http://localhost:3001`

### 2. Iniciar el Frontend
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

### 3. Iniciar Sesión
**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

### 4. Registrar Nuevos Usuarios
1. Ir a la página de registro: `http://localhost:5173/register`
2. Completar el formulario
3. Hacer clic en "Crear Cuenta"
4. Iniciar sesión con las nuevas credenciales

## 📁 Archivos Modificados/Creados

### Backend
- `backend-python/database.py` - Funciones de base de datos
- `backend-python/app.py` - Endpoints de autenticación
- `backend-python/.env` - SECRET_KEY agregada
- `backend-python/ether_sentinel.db` - Base de datos (se crea automáticamente)

### Frontend
- `src/lib/api.js` - Funciones de autenticación agregadas
- `src/pages/Login.jsx` - Conectado con API real
- `src/pages/Register.jsx` - Página nueva de registro
- `src/App.jsx` - ProtectedRoute y ruta de registro
- `src/components/Sidebar.jsx` - Botón de cerrar sesión

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con SHA-256
- ✅ Sesiones seguras con Flask
- ✅ Cookies con credenciales (httpOnly)
- ✅ Validación de contraseñas (mínimo 6 caracteres)
- ✅ Protección de rutas en frontend
- ✅ Usuario admin no se puede eliminar

## 📝 Notas Importantes

1. **Base de datos local**: Cada instalación tiene su propia base de datos SQLite
2. **Usuario admin**: Se crea automáticamente la primera vez que se inicia el backend
3. **Cambiar SECRET_KEY**: En producción, cambiar la SECRET_KEY en `.env`
4. **Distribución**: El proyecto es completamente portable - cada usuario tendrá su propia base de datos

## 🎯 Próximos Pasos (Opcional)

- [ ] Recuperación de contraseña por email
- [ ] Roles de usuario (admin, usuario normal)
- [ ] Cambiar contraseña desde la interfaz
- [ ] Gestión de usuarios desde Configuración
- [ ] Logs de actividad de usuarios
- [ ] Sesiones con expiración automática

## 🐛 Solución de Problemas

### Error: "No autenticado"
- Verificar que el backend esté corriendo
- Verificar que las cookies estén habilitadas
- Intentar cerrar sesión y volver a iniciar

### Error: "El usuario ya existe"
- El nombre de usuario ya está registrado
- Elegir un nombre de usuario diferente

### No se crea la base de datos
- Verificar permisos de escritura en `backend-python/`
- Verificar que Python tenga acceso a sqlite3

## 📞 Soporte

Si tienes problemas, verifica:
1. Backend corriendo en puerto 3001
2. Frontend corriendo en puerto 5173
3. Base de datos creada en `backend-python/ether_sentinel.db`
4. Consola del navegador para errores de JavaScript
5. Terminal del backend para errores de Python
