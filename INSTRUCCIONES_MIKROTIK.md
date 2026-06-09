# 🔧 Instrucciones para configurar MikroTik CHR

## Para: Karlo (el que tiene acceso al MikroTik)

El backend ya está listo y funcionando, pero **no puede conectarse al MikroTik** porque el puerto de la REST API no está abierto.

---

## ✅ Pasos a seguir en el MikroTik CHR

### 1. Conectarse al MikroTik

Usa **WinBox** o **SSH** para conectarte a:
- IP: `38.60.224.188`
- Usuario: `admin`
- Contraseña: `Taller#Inv2`

---

### 2. Habilitar la REST API (servicio www)

Ejecuta estos comandos en la terminal del MikroTik:

```bash
/ip service set www address="" disabled=no port=80
```

O desde WinBox:
1. Ve a **IP → Services**
2. Busca el servicio **www**
3. Haz doble clic
4. Desmarca **Disabled**
5. Asegúrate que **Port** sea **80**
6. En **Available From** deja vacío (o pon la IP desde donde se conectará el backend)
7. Click en **OK**

---

### 3. Abrir el puerto en el Firewall

Si el firewall está bloqueando el puerto 80, añade esta regla:

```bash
/ip firewall filter add chain=input protocol=tcp dst-port=80 action=accept comment="REST API - Ether Sentinel" place-before=0
```

O desde WinBox:
1. Ve a **IP → Firewall → Filter Rules**
2. Click en **+** (Add New)
3. En la pestaña **General**:
   - Chain: `input`
   - Protocol: `tcp`
   - Dst. Port: `80`
4. En la pestaña **Action**:
   - Action: `accept`
5. En **Comment** pon: `REST API - Ether Sentinel`
6. Click en **OK**
7. **IMPORTANTE:** Arrastra esta regla al **principio** de la lista (antes de cualquier regla de DROP)

---

### 4. Verificar que funciona

Desde tu navegador o terminal, prueba:

```bash
curl -u admin:Taller#Inv2 http://38.60.224.188/rest/system/identity
```

Debería responder algo como:
```json
{
  "name": "MikroTik"
}
```

---

### 5. (Opcional) Crear la lista de bloqueo

Para que el bloqueo de IPs funcione, crea la lista "blocked":

```bash
/ip firewall address-list add list=blocked address=0.0.0.0 comment="Lista de bloqueo inicial"
/ip firewall filter add chain=forward src-address-list=blocked action=drop comment="Bloquear IPs de la lista"
```

---

## 🧪 Probar desde el backend

Una vez que hayas hecho los pasos anteriores, desde la carpeta del proyecto ejecuta:

```bash
cd backend
npm start
```

Y en otra terminal:

```bash
curl http://localhost:3001/api/network/status
```

Si responde con datos del MikroTik, **¡todo funciona!** 🎉

---

## 🔒 Seguridad (IMPORTANTE)

Si el MikroTik está expuesto a internet, **NO dejes el puerto 80 abierto para todo el mundo**. Restringe el acceso solo a la IP del servidor donde corre el backend:

```bash
/ip service set www address=IP_DEL_SERVIDOR/32
```

Reemplaza `IP_DEL_SERVIDOR` con la IP pública desde donde se conectará el backend.

---

## 📞 Dudas

Si algo no funciona, revisa:
1. Que el servicio `www` esté habilitado: `/ip service print`
2. Que el firewall no esté bloqueando: `/ip firewall filter print`
3. Que puedas hacer ping al MikroTik: `ping 38.60.224.188`

Cualquier cosa, avísame.
