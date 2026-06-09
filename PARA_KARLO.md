# 📢 Para Karlo — URGENTE

## 🎯 Qué necesito que hagas

El backend ya está listo y funcionando, pero **no puede conectarse al MikroTik** porque el puerto de la REST API no está abierto.

---

## ⚡ Pasos rápidos (5 minutos)

### 1. Conectarte al MikroTik CHR

**Opción A — WinBox:**
- Descargar: https://mikrotik.com/download
- Conectar a: `38.60.224.188`
- Usuario: `admin`
- Contraseña: `Taller#Inv2`

**Opción B — SSH:**
```bash
ssh admin@38.60.224.188
# Contraseña: Taller#Inv2
```

---

### 2. Habilitar la REST API

Ejecuta estos comandos en la terminal del MikroTik:

```bash
/ip service set www address="" disabled=no port=80
```

**O desde WinBox:**
1. Ve a **IP → Services**
2. Busca **www**
3. Doble click
4. Desmarca **Disabled**
5. Asegúrate que **Port** = **80**
6. Click **OK**

---

### 3. Abrir el puerto en el Firewall

```bash
/ip firewall filter add chain=input protocol=tcp dst-port=80 action=accept comment="REST API" place-before=0
```

**O desde WinBox:**
1. **IP → Firewall → Filter Rules**
2. Click **+** (Add New)
3. **General tab:**
   - Chain: `input`
   - Protocol: `tcp`
   - Dst. Port: `80`
4. **Action tab:**
   - Action: `accept`
5. **Comment:** `REST API`
6. Click **OK**
7. **IMPORTANTE:** Arrastra esta regla al **principio** de la lista

---

### 4. Verificar que funciona

Desde tu navegador o terminal:

```bash
curl -u admin:Taller#Inv2 http://38.60.224.188/rest/system/identity
```

**Debe responder:**
```json
{
  "name": "MikroTik"
}
```

Si responde eso, **¡funciona!** ✅

---

### 5. (Opcional) Crear lista de bloqueo

Para que el bloqueo de IPs funcione:

```bash
/ip firewall address-list add list=blocked address=0.0.0.0 comment="Lista inicial"
/ip firewall filter add chain=forward src-address-list=blocked action=drop comment="Bloquear IPs"
```

---

## 🧪 Cómo probar que todo funciona

Una vez que hayas hecho los pasos anteriores, avísame y yo pruebo desde el backend.

O puedes probar tú mismo:

```bash
# Desde tu PC
curl http://38.60.224.188/rest/ip/dhcp-server/lease
```

Si responde con una lista de dispositivos, **todo está listo**.

---

## 🔒 Seguridad (IMPORTANTE)

Si el MikroTik está expuesto a internet, **NO dejes el puerto 80 abierto para todo el mundo**.

Restringe el acceso solo a la IP del servidor donde corre el backend:

```bash
/ip service set www address=IP_DEL_SERVIDOR/32
```

Reemplaza `IP_DEL_SERVIDOR` con la IP pública desde donde se conectará el backend.

---

## 📞 Si algo falla

**Problema:** No puedo conectarme al MikroTik
- Verifica que la IP `38.60.224.188` responda a ping
- Verifica que el usuario/contraseña sean correctos

**Problema:** El comando no funciona
- Asegúrate de estar en la terminal del MikroTik (no en tu PC)
- Copia y pega los comandos exactamente como están

**Problema:** El firewall bloquea la conexión
- Verifica que la regla de `accept` esté **antes** de cualquier regla de `drop`
- Usa: `/ip firewall filter print` para ver el orden

---

## ✅ Checklist

- [ ] Me conecté al MikroTik
- [ ] Habilité el servicio `www`
- [ ] Abrí el puerto 80 en el firewall
- [ ] Verifiqué que responda con curl
- [ ] Creé la lista de bloqueo (opcional)
- [ ] Le avisé a Acosta que ya está listo

---

**Una vez que hagas esto, el panel web va a funcionar al 100% y vamos a poder bloquear dispositivos en tiempo real.** 🚀

Cualquier duda, avísame.

— Acosta
