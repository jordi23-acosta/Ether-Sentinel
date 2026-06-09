# 🛡️ Ether Sentinel

Panel de control web para gestión y monitoreo de red con MikroTik CHR.

## 📋 Características

- **Dashboard en tiempo real** — Estadísticas de red, dispositivos conectados, tráfico
- **Gestión de dispositivos** — Ver, bloquear y desbloquear dispositivos por IP
- **Control de contenido** — Bloqueo de dominios mediante DNS estático
- **Horarios de acceso** — Programación de ventanas de tiempo para acceso a la red
- **Configuración** — Ajustes de red, credenciales, información del sistema

## 🏗️ Arquitectura

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Frontend  │ ───> │   Backend   │ ───> │  MikroTik    │
│  React+Vite │      │ Node+Express│      │  CHR (API)   │
│  :5173      │      │  :3001      │      │ 38.60.224... │
└─────────────┘      └─────────────┘      └──────────────┘
```

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd ether-sentinel
```

### 2. Instalar dependencias

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 3. Configurar variables de entorno

**Frontend** — Crea `.env` en la raíz:
```env
VITE_API_URL=http://localhost:3001/api
```

**Backend** — Edita `backend/.env`:
```env
MIKROTIK_HOST=38.60.224.188
MIKROTIK_PORT=80
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=Taller#Inv2
MIKROTIK_USE_HTTPS=false
PORT=3001
```

### 4. Configurar MikroTik CHR

**⚠️ IMPORTANTE:** El MikroTik debe tener la REST API habilitada.

Ver instrucciones detalladas en: **[INSTRUCCIONES_MIKROTIK.md](./INSTRUCCIONES_MIKROTIK.md)**

Resumen rápido:
```bash
# En el MikroTik CHR
/ip service set www address="" disabled=no port=80
/ip firewall filter add chain=input protocol=tcp dst-port=80 action=accept comment="REST API"
```

## 🏃 Ejecución

### Modo desarrollo

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

Abre el navegador en: **http://localhost:5173**

### Modo producción

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
npm run build
npm run preview
```

## 🔐 Credenciales de prueba

**Panel web:**
- Usuario: `admin`
- Contraseña: `admin123`

**MikroTik:**
- IP: `38.60.224.188`
- Usuario: `admin`
- Contraseña: `Taller#Inv2`

## 📡 API Endpoints

### Dispositivos
- `GET /api/devices` — Lista dispositivos
- `POST /api/devices/:ip/block` — Bloquea IP
- `POST /api/devices/:ip/unblock` — Desbloquea IP

### Red
- `GET /api/network/status` — Estado de la red
- `GET /api/network/traffic` — Estadísticas de tráfico

### Contenido
- `GET /api/content/blocked-domains` — Dominios bloqueados
- `POST /api/content/block-domain` — Bloquea dominio
- `DELETE /api/content/unblock-domain/:domain` — Desbloquea dominio

### Horarios
- `GET /api/schedule` — Obtiene horario
- `PUT /api/schedule` — Actualiza horario
- `PATCH /api/schedule/:hour/:day` — Alterna celda

Ver documentación completa en: **[backend/README.md](./backend/README.md)**

## 🛠️ Stack Tecnológico

**Frontend:**
- React 18
- React Router v6
- Vite 5
- Lucide React (iconos)
- CSS puro con variables

**Backend:**
- Node.js
- Express
- Axios (cliente HTTP)
- dotenv

**Router:**
- MikroTik CHR
- REST API

## 📁 Estructura del proyecto

```
ether-sentinel/
├── src/                    # Frontend React
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas de la app
│   ├── data/               # Datos mock (deprecado)
│   ├── lib/                # Cliente API
│   ├── App.jsx             # Componente principal
│   └── main.jsx            # Entry point
├── backend/                # Backend Node.js
│   ├── lib/                # Cliente MikroTik
│   ├── routes/             # Rutas de la API
│   ├── server.js           # Servidor Express
│   └── .env                # Configuración
├── public/                 # Assets estáticos
└── package.json            # Dependencias frontend
```

## 🐛 Troubleshooting

### Error: "No se puede conectar con el MikroTik"

1. Verifica que el backend esté corriendo: `curl http://localhost:3001/health`
2. Verifica que el MikroTik responda: `curl -u admin:Taller#Inv2 http://38.60.224.188/rest/system/identity`
3. Revisa que el puerto 80 esté abierto en el firewall del MikroTik
4. Comprueba las credenciales en `backend/.env`

### Error: "CORS blocked"

El backend ya tiene CORS habilitado. Si persiste:
1. Verifica que `VITE_API_URL` en `.env` apunte a `http://localhost:3001/api`
2. Reinicia el backend

### Los dispositivos no aparecen

1. Verifica que haya dispositivos conectados al MikroTik
2. Comprueba que el DHCP server esté activo: `/ip dhcp-server print`
3. Revisa los logs del backend

## 📝 Notas de desarrollo

- Los horarios se guardan en memoria (se pierden al reiniciar el backend)
- Para producción, implementar persistencia con BD (SQLite/PostgreSQL)
- El bloqueo de IPs usa `firewall address-list` del MikroTik
- El bloqueo de dominios usa DNS estático redirigiendo a `0.0.0.0`

## 👥 Equipo

- **Karlo** — Configuración MikroTik CHR
- **Acosta** — Frontend y Backend

## 📄 Licencia

Proyecto académico — Taller de Investigación 2
