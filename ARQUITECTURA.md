# 🏗️ Arquitectura del Sistema

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR WEB                           │
│                    http://localhost:5173                        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │Dashboard │  │Dispositiv│  │Horarios  │  │Contenido │       │
│  │          │  │   os     │  │          │  │          │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                 │
│                    React 18 + React Router                      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ fetch() / axios
                         │ http://localhost:3001/api
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                          │
│                    http://localhost:3001                        │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API REST Endpoints                    │   │
│  │                                                          │   │
│  │  GET  /api/devices              → Lista dispositivos    │   │
│  │  POST /api/devices/:ip/block    → Bloquea IP           │   │
│  │  POST /api/devices/:ip/unblock  → Desbloquea IP        │   │
│  │  GET  /api/network/status       → Estado de red        │   │
│  │  GET  /api/network/traffic      → Tráfico              │   │
│  │  POST /api/content/block-domain → Bloquea dominio      │   │
│  │  GET  /api/schedule             → Horarios             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Cliente MikroTik (mikrotik.js)             │   │
│  │                                                          │   │
│  │  • Autenticación Basic Auth                             │   │
│  │  • Manejo de errores                                    │   │
│  │  • Logging de requests                                  │   │
│  │  • Timeout de 10 segundos                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                    Node.js + Express + Axios                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTP Basic Auth
                         │ http://38.60.224.188/rest
                         │ Usuario: admin
                         │ Contraseña: Taller#Inv2
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MIKROTIK CHR (Router)                        │
│                      38.60.224.188:80                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   REST API Endpoints                     │   │
│  │                                                          │   │
│  │  /rest/system/identity          → Identidad del router  │   │
│  │  /rest/system/resource          → CPU, RAM, Uptime      │   │
│  │  /rest/ip/dhcp-server/lease     → Dispositivos DHCP     │   │
│  │  /rest/ip/arp                   → Tabla ARP             │   │
│  │  /rest/interface                → Interfaces de red     │   │
│  │  /rest/ip/firewall/address-list → Lista de bloqueo      │   │
│  │  /rest/ip/firewall/filter       → Reglas de firewall    │   │
│  │  /rest/ip/dns/static            → DNS estático          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│                    RouterOS 7.x + REST API                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

### Ejemplo 1: Listar dispositivos

```
1. Usuario abre /dispositivos en el navegador
   ↓
2. React llama a getDevices() desde api.js
   ↓
3. fetch('http://localhost:3001/api/devices')
   ↓
4. Backend recibe GET /api/devices
   ↓
5. Backend llama a mikrotik.getDhcpLeases()
   ↓
6. Axios hace GET http://38.60.224.188/rest/ip/dhcp-server/lease
   ↓
7. MikroTik responde con JSON de dispositivos
   ↓
8. Backend procesa y combina con datos de ARP
   ↓
9. Backend responde al frontend con JSON
   ↓
10. React actualiza el estado y renderiza la tabla
```

---

### Ejemplo 2: Bloquear una IP

```
1. Usuario hace click en toggle de un dispositivo
   ↓
2. React llama a blockDevice(ip, comment)
   ↓
3. fetch('http://localhost:3001/api/devices/192.168.1.100/block', {
     method: 'POST',
     body: JSON.stringify({ comment: 'Bloqueado desde panel' })
   })
   ↓
4. Backend recibe POST /api/devices/192.168.1.100/block
   ↓
5. Backend llama a mikrotik.blockIP('192.168.1.100', 'Bloqueado...')
   ↓
6. Axios hace POST http://38.60.224.188/rest/ip/firewall/address-list/add
   Body: {
     list: 'blocked',
     address: '192.168.1.100',
     comment: 'Bloqueado desde panel'
   }
   ↓
7. MikroTik añade la IP a la lista 'blocked'
   ↓
8. MikroTik responde con éxito
   ↓
9. Backend responde al frontend con { success: true }
   ↓
10. React recarga la lista de dispositivos
    ↓
11. El dispositivo aparece como BLOQUEADO (rojo)
```

---

## Tecnologías Utilizadas

### Frontend
- **React 18** — Librería de UI
- **React Router v6** — Navegación entre páginas
- **Vite 5** — Build tool y dev server
- **Lucide React** — Iconos
- **CSS puro** — Estilos con variables CSS

### Backend
- **Node.js** — Runtime de JavaScript
- **Express 4** — Framework web
- **Axios** — Cliente HTTP para llamar al MikroTik
- **CORS** — Middleware para permitir requests del frontend
- **dotenv** — Manejo de variables de entorno

### Router
- **MikroTik CHR** — Cloud Hosted Router
- **RouterOS 7.x** — Sistema operativo del router
- **REST API** — Interfaz HTTP para gestión

---

## Seguridad

### Autenticación
- **Frontend → Backend:** Sin autenticación (TODO: implementar JWT)
- **Backend → MikroTik:** HTTP Basic Auth (usuario/contraseña en headers)

### CORS
- Backend permite requests desde cualquier origen (desarrollo)
- En producción, restringir a dominio específico

### Variables de entorno
- Credenciales del MikroTik en `backend/.env` (NO subir a Git)
- `.gitignore` configurado para ignorar archivos sensibles

### Firewall del MikroTik
- Puerto 80 abierto solo para REST API
- Recomendado: Restringir acceso por IP de origen
- Usar HTTPS (puerto 443) en producción

---

## Escalabilidad

### Limitaciones actuales
- **Horarios en memoria:** Se pierden al reiniciar el backend
- **Sin caché:** Cada request va directo al MikroTik
- **Sin autenticación:** Cualquiera puede acceder
- **Sin logs:** No se registran acciones de usuarios

### Mejoras futuras
- **Base de datos:** SQLite o PostgreSQL para persistencia
- **Redis:** Caché de datos del MikroTik (reducir latencia)
- **JWT:** Autenticación con tokens
- **WebSockets:** Actualizaciones en tiempo real
- **Rate limiting:** Limitar requests por IP
- **Logs:** Registro de todas las acciones (quién, qué, cuándo)

---

## Despliegue

### Desarrollo (actual)
```
Frontend:  http://localhost:5173  (Vite dev server)
Backend:   http://localhost:3001  (Node.js)
MikroTik:  http://38.60.224.188   (Router en la nube)
```

### Producción (futuro)
```
Frontend:  https://ether-sentinel.com  (Nginx + build estático)
Backend:   https://api.ether-sentinel.com  (PM2 + Node.js)
MikroTik:  https://38.60.224.188:443  (HTTPS con certificado)
```

**Opciones de hosting:**
- **Frontend:** Vercel, Netlify, GitHub Pages
- **Backend:** DigitalOcean, AWS EC2, Heroku
- **Base de datos:** Supabase, PlanetScale, Railway

---

## Monitoreo

### Logs del backend
```bash
cd backend
npm start

# Verás logs como:
→ MikroTik GET /rest/ip/dhcp-server/lease
← MikroTik 200 /rest/ip/dhcp-server/lease
[2026-05-21T01:45:19.654Z] GET /api/devices
```

### Health check
```bash
curl http://localhost:3001/health
```

### Verificar conexión con MikroTik
```bash
curl http://localhost:3001/api/network/status
```

---

## Mantenimiento

### Actualizar dependencias
```bash
# Frontend
npm update

# Backend
cd backend
npm update
```

### Backup de configuración
```bash
# Exportar configuración del MikroTik
/export file=backup-$(date +%Y%m%d)
```

### Reiniciar servicios
```bash
# Backend
cd backend
npm start

# Frontend
npm run dev
```

---

## Troubleshooting

### Backend no se conecta al MikroTik
1. Verificar que el servicio `www` esté habilitado
2. Verificar que el puerto 80 esté abierto en el firewall
3. Probar con curl: `curl -u admin:Taller#Inv2 http://38.60.224.188/rest/system/identity`

### Frontend no se conecta al backend
1. Verificar que el backend esté corriendo: `curl http://localhost:3001/health`
2. Verificar `.env` tiene `VITE_API_URL=http://localhost:3001/api`
3. Reiniciar el frontend: `npm run dev`

### Dispositivos no aparecen
1. Verificar que haya dispositivos conectados al MikroTik
2. Verificar que el DHCP server esté activo: `/ip dhcp-server print`
3. Revisar logs del backend

---

## Recursos

- **MikroTik REST API Docs:** https://help.mikrotik.com/docs/display/ROS/REST+API
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/

---

**Última actualización:** 21 de mayo de 2026
