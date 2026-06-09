# Ether Sentinel - Backend

Backend proxy para conectar el frontend de Ether Sentinel con la API REST de MikroTik CHR.

## 🚀 Instalación

```bash
cd backend
npm install
```

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` con las credenciales de tu MikroTik:
```env
MIKROTIK_HOST=38.60.224.188
MIKROTIK_PORT=80
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=Taller#Inv2
MIKROTIK_USE_HTTPS=false
PORT=3001
```

## 🏃 Ejecución

### Modo desarrollo (con auto-reload):
```bash
npm run dev
```

### Modo producción:
```bash
npm start
```

El servidor estará disponible en `http://localhost:3001`

## 📡 Endpoints disponibles

### Health Check
- `GET /health` - Verifica que el servidor esté corriendo

### Dispositivos
- `GET /api/devices` - Lista todos los dispositivos conectados
- `POST /api/devices/:ip/block` - Bloquea un dispositivo por IP
- `POST /api/devices/:ip/unblock` - Desbloquea un dispositivo por IP
- `GET /api/devices/blocked` - Lista dispositivos bloqueados

### Red
- `GET /api/network/status` - Estado general de la red
- `GET /api/network/traffic` - Estadísticas de tráfico
- `GET /api/network/interfaces` - Lista de interfaces

### Contenido
- `GET /api/content/blocked-domains` - Lista dominios bloqueados
- `POST /api/content/block-domain` - Bloquea un dominio
- `DELETE /api/content/unblock-domain/:domain` - Desbloquea un dominio
- `GET /api/content/firewall-rules` - Reglas del firewall

### Horarios
- `GET /api/schedule` - Obtiene el horario actual
- `PUT /api/schedule` - Actualiza el horario completo
- `PATCH /api/schedule/:hour/:day` - Alterna una celda del horario

## 🔧 Requisitos del MikroTik

Para que el backend funcione, el MikroTik CHR debe tener:

1. **REST API habilitada** en el puerto 80 o 443:
```
/ip service set www address="" disabled=no
```

2. **Regla de firewall** para aceptar conexiones al puerto de la API:
```
/ip firewall filter add chain=input protocol=tcp dst-port=80 action=accept comment="REST API"
```

3. **Usuario con permisos** (el usuario `admin` ya los tiene):
```
/user print
```

## 🐛 Troubleshooting

### Error: "No se puede conectar con el MikroTik"
- Verifica que el puerto 80 o 443 esté abierto en el MikroTik
- Comprueba que la REST API esté habilitada: `/ip service print`
- Prueba hacer ping a la IP del MikroTik

### Error: "Credenciales incorrectas"
- Verifica usuario y contraseña en el archivo `.env`
- Comprueba que el usuario tenga permisos de API

### Error: "Recurso no encontrado"
- Algunos endpoints requieren configuración previa en el MikroTik
- Por ejemplo, para bloquear IPs necesitas crear la lista "blocked":
```
/ip firewall address-list add list=blocked address=0.0.0.0 comment="Lista de bloqueo"
```

## 📝 Notas

- Los horarios se guardan en memoria y se pierden al reiniciar. Para producción, implementar persistencia con SQLite o PostgreSQL.
- El bloqueo de dominios usa DNS estático del MikroTik, redirigiendo a 0.0.0.0
- El bloqueo de IPs usa firewall address-list del MikroTik
