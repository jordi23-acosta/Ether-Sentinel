# Ether Sentinel - Backend Python

Backend en Python con Flask para conectar con MikroTik RouterOS API.

## 🚀 Instalación

### 1. Instalar Python 3.8+

Verifica que tengas Python instalado:
```bash
python --version
```

### 2. Crear entorno virtual (recomendado)

```bash
python -m venv venv
```

**Activar en Windows:**
```bash
venv\Scripts\activate
```

**Activar en Linux/Mac:**
```bash
source venv/bin/activate
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Configurar variables de entorno

Edita el archivo `.env`:
```env
MIKROTIK_HOST=10.0.2.15
MIKROTIK_PORT=8728
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=TU_PASSWORD
PORT=3001
```

## 🏃 Ejecución

```bash
python app.py
```

El servidor estará disponible en `http://localhost:3001`

## 📡 Endpoints

### Health Check
- `GET /health` - Verifica que el servidor esté corriendo

### Dispositivos
- `GET /api/devices` - Lista dispositivos conectados
- `POST /api/devices/:ip/block` - Bloquea una IP
- `POST /api/devices/:ip/unblock` - Desbloquea una IP
- `GET /api/devices/blocked` - Lista IPs bloqueadas

### Red
- `GET /api/network/status` - Estado general de la red
- `GET /api/network/traffic` - Estadísticas de tráfico
- `GET /api/network/interfaces` - Lista de interfaces

### Contenido
- `GET /api/content/blocked-domains` - Dominios bloqueados
- `POST /api/content/block-domain` - Bloquea un dominio
- `DELETE /api/content/unblock-domain/:domain` - Desbloquea un dominio
- `GET /api/content/firewall-rules` - Reglas del firewall

### Horarios
- `GET /api/schedule` - Obtiene el horario
- `PUT /api/schedule` - Actualiza el horario
- `PATCH /api/schedule/:hour/:day` - Alterna una celda

## 🔧 Requisitos del MikroTik

El MikroTik debe tener:

1. **API habilitada** en el puerto 8728:
```
/ip service set api address="" disabled=no port=8728
```

2. **Regla de firewall** para aceptar conexiones:
```
/ip firewall filter add chain=input protocol=tcp dst-port=8728 action=accept comment="RouterOS API"
```

## 🧪 Probar conexión

```bash
python -c "from mikrotik_client import mikrotik; mikrotik.connect(); print(mikrotik.get_system_identity())"
```

## 📝 Notas

- La API de MikroTik usa el puerto **8728** (no REST, es la API binaria)
- Los horarios se guardan en memoria (se pierden al reiniciar)
- Para producción, usar Gunicorn o uWSGI en lugar de Flask dev server
