# 🚀 Inicio Rápido — Ether Sentinel

## ⚡ Arrancar todo en 3 pasos

### 1️⃣ Configurar la contraseña del MikroTik

Edita `backend-python/.env` y cambia `TU_PASSWORD` por la contraseña real:

```env
MIKROTIK_HOST=10.0.2.15
MIKROTIK_PORT=8728
MIKROTIK_USER=admin
MIKROTIK_PASSWORD=aqui_tu_password_real
```

### 2️⃣ Ejecutar el script

Doble click en:
```
start-dev-python.bat
```

O desde la terminal:
```bash
.\start-dev-python.bat
```

### 3️⃣ Abrir el navegador

```
http://localhost:5173
```

**Credenciales:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## ✅ Eso es todo

Si todo funciona, verás:
- ✅ Backend Python corriendo en `http://localhost:3001`
- ✅ Frontend React corriendo en `http://localhost:5173`
- ✅ Dispositivos reales del MikroTik en la página de Dispositivos
- ✅ Puedes bloquear/desbloquear IPs en tiempo real

---

## 🐛 Si algo falla

### Error: "No module named 'flask'"

```bash
cd backend-python
pip install -r requirements.txt
```

### Error: "No se puede conectar al MikroTik"

Verifica que:
1. La IP `10.0.2.15` sea correcta
2. El puerto `8728` esté abierto
3. La contraseña en `.env` sea correcta
4. El servicio API esté habilitado en el MikroTik:
   ```
   /ip service set api address="" disabled=no port=8728
   ```

### Error: "Puerto 3001 ya en uso"

Cierra el backend anterior (Node.js) si lo tenías corriendo.

---

## 📞 Arquitectura

```
Frontend (React)  →  Backend (Python + Flask)  →  MikroTik CHR
  :5173                    :3001                   10.0.2.15:8728
```

---

## 🎯 Funciones disponibles

- ✅ Ver dispositivos conectados
- ✅ Bloquear/desbloquear IPs
- ✅ Ver interfaces de red
- ✅ Ver estado del router (CPU, RAM, uptime)
- ✅ Bloquear/desbloquear dominios
- ✅ Gestionar horarios de acceso
- ✅ Ver reglas del firewall

---

**¡Listo para usar! 🎉**
