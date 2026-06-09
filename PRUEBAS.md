# 🧪 Guía de Pruebas

## Checklist de verificación

### ✅ Paso 1: Verificar instalación

```bash
# Verificar Node.js instalado
node --version
# Debe mostrar v18 o superior

# Verificar dependencias frontend
npm list --depth=0

# Verificar dependencias backend
cd backend
npm list --depth=0
cd ..
```

---

### ✅ Paso 2: Probar backend solo

```bash
cd backend
npm start
```

**Debe mostrar:**
```
🚀 Backend corriendo en http://localhost:3001
📡 MikroTik: 38.60.224.188:80
🔐 Usuario: admin
```

**Probar health check:**

Abre otra terminal:
```bash
curl http://localhost:3001/health
```

**Debe responder:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-21T...",
  "mikrotik": {
    "host": "38.60.224.188",
    "port": "80"
  }
}
```

---

### ✅ Paso 3: Probar conexión con MikroTik

**Desde el navegador o curl:**
```bash
curl http://localhost:3001/api/network/status
```

**Si funciona, debe responder:**
```json
{
  "identity": "MikroTik",
  "uptime": "14d 6h 12m",
  "cpu": "5",
  "memory": { ... },
  "version": "7.x",
  "interfaces": [ ... ]
}
```

**Si NO funciona, verás:**
```json
{
  "error": "No se puede conectar con el MikroTik..."
}
```

➡️ **Si falla:** Tu compañero Karlo debe seguir las instrucciones en `INSTRUCCIONES_MIKROTIK.md`

---

### ✅ Paso 4: Probar frontend

**En otra terminal:**
```bash
npm run dev
```

**Debe mostrar:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Abrir en el navegador:** http://localhost:5173

---

### ✅ Paso 5: Probar login

1. Ir a http://localhost:5173
2. Debe redirigir a `/login`
3. Ingresar:
   - Usuario: `admin`
   - Contraseña: `admin123`
4. Click en "Iniciar Sesión"
5. Debe redirigir a `/dashboard`

---

### ✅ Paso 6: Probar Dashboard

**Si el MikroTik está conectado:**
- Debe mostrar estadísticas reales
- Número de dispositivos conectados
- Tráfico de red (MB subidos/bajados)
- Uptime del router

**Si el MikroTik NO está conectado:**
- Mostrará "Conectando con el MikroTik..."
- Los datos no se actualizarán

---

### ✅ Paso 7: Probar página de Dispositivos

1. Ir a `/dispositivos` desde el menú lateral
2. Click en "Dispositivos"

**Si el MikroTik está conectado:**
- Debe mostrar tabla con dispositivos conectados
- Cada dispositivo tiene:
  - Nombre
  - IP
  - MAC
  - Tipo (Wi-Fi/Ethernet)
  - Toggle para bloquear/desbloquear

**Probar bloqueo:**
1. Click en el toggle de un dispositivo activo
2. Debe cambiar a "BLOQUEADO" (rojo)
3. En el MikroTik, verificar:
   ```bash
   /ip firewall address-list print where list=blocked
   ```
4. Debe aparecer la IP bloqueada

---

### ✅ Paso 8: Probar Contenido (bloqueo de dominios)

1. Ir a `/contenido`
2. En "Dominios Bloqueados", escribir: `facebook.com`
3. Click en "Añadir"

**Si funciona:**
- El dominio aparece en la lista
- En el MikroTik:
  ```bash
  /ip dns static print
  ```
- Debe aparecer `facebook.com` apuntando a `0.0.0.0`

---

### ✅ Paso 9: Probar Horarios

1. Ir a `/horarios`
2. Click en cualquier celda de la grilla
3. Debe cambiar de color (azul = activo, gris = restringido)

**Nota:** Los horarios se guardan en memoria del backend. Al reiniciar, se pierden.

---

### ✅ Paso 10: Probar Configuración

1. Ir a `/configuracion`
2. Cambiar algún valor de red (ej. DNS)
3. Click en "Implementar Configuración"
4. Debe mostrar mensaje de éxito

**Nota:** Esta página solo muestra la interfaz. Para aplicar cambios reales al MikroTik, hay que implementar los endpoints correspondientes.

---

## 🐛 Problemas comunes

### Error: "Cannot find module 'express'"

**Solución:**
```bash
cd backend
npm install
```

---

### Error: "EADDRINUSE: address already in use :::3001"

**Solución:** El puerto 3001 ya está en uso.

**Windows:**
```bash
netstat -ano | findstr :3001
taskkill /PID <numero_pid> /F
```

---

### Error: "Failed to fetch" en el frontend

**Causas posibles:**
1. El backend no está corriendo → Iniciar con `cd backend && npm start`
2. La URL de la API es incorrecta → Verificar `.env` tiene `VITE_API_URL=http://localhost:3001/api`
3. CORS bloqueado → El backend ya tiene CORS habilitado, reiniciar ambos servicios

---

### Los dispositivos no aparecen

**Verificar:**
1. Que el MikroTik esté accesible
2. Que haya dispositivos conectados al router
3. Que el DHCP server esté activo en el MikroTik

**Probar manualmente:**
```bash
curl -u admin:Taller#Inv2 http://38.60.224.188/rest/ip/dhcp-server/lease
```

---

## 📊 Pruebas de carga

### Probar múltiples requests simultáneas

```bash
# Instalar Apache Bench (opcional)
# Windows: descargar desde https://www.apachelounge.com/download/

ab -n 100 -c 10 http://localhost:3001/api/network/status
```

---

## ✅ Checklist final

- [ ] Backend arranca sin errores
- [ ] Frontend arranca sin errores
- [ ] Login funciona
- [ ] Dashboard muestra datos (mock o reales)
- [ ] Dispositivos se listan correctamente
- [ ] Bloqueo/desbloqueo de IP funciona (si MikroTik conectado)
- [ ] Bloqueo de dominios funciona (si MikroTik conectado)
- [ ] Horarios se pueden editar
- [ ] Configuración se puede ver

---

## 🎯 Próximos pasos

Una vez que todo funcione:

1. **Karlo debe habilitar la API del MikroTik** (ver `INSTRUCCIONES_MIKROTIK.md`)
2. Probar bloqueos reales de IPs
3. Probar bloqueos reales de dominios
4. Implementar persistencia de horarios (BD)
5. Añadir autenticación real (JWT)
6. Deploy en servidor de producción
