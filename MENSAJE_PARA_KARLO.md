# 📢 Karlo — Backend en Python listo

## ✅ Ya está todo configurado

Cambié el backend a **Python con Flask** usando la librería `routeros-api` que me pasaste.

---

## 🔧 Lo único que necesito de ti:

### 1️⃣ La contraseña del MikroTik

Necesito que me pases la contraseña real del MikroTik para ponerla en el archivo de configuración.

Actualmente está así:
```
Host: 10.0.2.15
Puerto: 8728
Usuario: admin
Contraseña: TU_PASSWORD  ← Necesito la real
```

### 2️⃣ Verificar que la API esté habilitada

Conéctate al MikroTik y ejecuta:

```bash
/ip service print
```

Busca la línea de **api** y verifica que:
- `disabled: no` (debe estar habilitada)
- `port: 8728` (puerto correcto)

Si está deshabilitada, ejecuta:
```bash
/ip service set api address="" disabled=no port=8728
```

### 3️⃣ Abrir el puerto en el firewall (si es necesario)

```bash
/ip firewall filter add chain=input protocol=tcp dst-port=8728 action=accept comment="RouterOS API" place-before=0
```

---

## 🚀 Una vez que me pases la contraseña:

1. La pongo en `backend-python/.env`
2. Ejecuto `start-dev-python.bat`
3. Todo funciona al 100%

---

## 📊 Arquitectura del proyecto

```
Ether Sentinel
│
├── Frontend (React)           → Puerto 5173
├── Backend (Python + Flask)   → Puerto 3001
├── MikroTik CHR               → 10.0.2.15:8728
└── RouterOS API               → Librería routeros-api
```

---

## 🎯 Funciones que ya están implementadas:

✅ Ver dispositivos conectados  
✅ Ver interfaces de red  
✅ Bloquear IP  
✅ Desbloquear IP  
✅ Ver estado del router (CPU, RAM, uptime)  
✅ Administrar reglas firewall  
✅ Bloquear/desbloquear dominios  
✅ Gestionar horarios de acceso  

---

## 📝 Resumen técnico

**Backend Python:**
- Flask 3.0
- routeros-api 0.17.0
- CORS habilitado
- Endpoints REST completos

**Conexión MikroTik:**
- Puerto 8728 (API binaria, no REST)
- Autenticación con usuario/contraseña
- Plaintext login habilitado

**Frontend:**
- React 18
- Vite 5
- Ya configurado para llamar al backend Python

---

**Solo necesito la contraseña y arrancamos.** 🚀

— Acosta
