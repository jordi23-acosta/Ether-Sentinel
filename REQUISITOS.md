# 🛠️ Requisitos y Herramientas - Ether Sentinel

## 📦 Herramientas Necesarias

### 1. 💻 VirtualBox
**¿Qué es?** Máquina virtual para ejecutar MikroTik CHR

**Versión:** 7.0 o superior

**Descargar:** https://www.virtualbox.org/wiki/Downloads

**Instalación:**
- Windows: Descargar `.exe` y ejecutar
- macOS: Descargar `.dmg` y ejecutar
- Linux: `sudo apt install virtualbox`

---

### 2. 🌐 MikroTik CHR
**¿Qué es?** Cloud Hosted Router - Sistema operativo de red

**Versión:** Última versión estable

**Descargar:** https://mikrotik.com/download

**Archivo necesario:** `chr-x.xx.vdi` (VDI image para VirtualBox)

**Configuración básica:**
```bash
# Login inicial
Usuario: admin
Contraseña: [vacío]

# Habilitar API
/ip service enable api

# Ver IP asignada
/ip address print
```

---

### 3. 🐍 Python
**¿Qué es?** Lenguaje para ejecutar el backend

**Versión:** 3.8 o superior (recomendado 3.11)

**Descargar:** https://www.python.org/downloads/

**Instalación:**
- ✅ **IMPORTANTE**: Marcar "Add Python to PATH" en Windows
- Verificar: `python --version`

---

### 4. 📦 Node.js
**¿Qué es?** Entorno para ejecutar el frontend

**Versión:** 16.0 o superior (recomendado 18.x LTS)

**Descargar:** https://nodejs.org/

**Instalación:**
- Descargar versión LTS (Long Term Support)
- Verificar: `node --version` y `npm --version`

---

## 🚀 Inicio Rápido

### Paso 1: Instalar Herramientas
```bash
1. Instalar VirtualBox
2. Descargar MikroTik CHR (archivo .vdi)
3. Instalar Python
4. Instalar Node.js
```

### Paso 2: Configurar MikroTik
```bash
1. Crear VM en VirtualBox con el archivo .vdi
2. Iniciar VM
3. Login: admin (sin contraseña)
4. Habilitar API: /ip service enable api
5. Anotar la IP: /ip address print
```

### Paso 3: Configurar Ether Sentinel
```bash
# Backend
cd backend-python
pip install -r requirements.txt
cp .env.example .env
# Editar .env con la IP de MikroTik
python app.py

# Frontend (en otra terminal)
npm install
npm run dev
```

### Paso 4: Acceder
```
http://localhost:5173/
Usuario: admin
Contraseña: admin123
```

---

## 📊 Requisitos del Sistema

| Componente | Mínimo | Recomendado |
|------------|--------|-------------|
| **CPU** | Intel Core i3 | Intel Core i5 o superior |
| **RAM** | 4 GB | 8 GB |
| **Disco** | 20 GB libres | 50 GB libres |
| **Red** | Conexión a internet | Conexión estable |

---

## 🔗 Links Directos de Descarga

### Windows
- [VirtualBox para Windows](https://download.virtualbox.org/virtualbox/7.0.12/VirtualBox-7.0.12-159484-Win.exe)
- [Python para Windows](https://www.python.org/ftp/python/3.11.7/python-3.11.7-amd64.exe)
- [Node.js para Windows](https://nodejs.org/dist/v18.19.0/node-v18.19.0-x64.msi)
- [MikroTik CHR](https://download.mikrotik.com/routeros/7.13/chr-7.13.vdi)

### macOS
- [VirtualBox para macOS](https://download.virtualbox.org/virtualbox/7.0.12/VirtualBox-7.0.12-159484-OSX.dmg)
- [Python para macOS](https://www.python.org/ftp/python/3.11.7/python-3.11.7-macos11.pkg)
- [Node.js para macOS](https://nodejs.org/dist/v18.19.0/node-v18.19.0.pkg)

### Linux (Ubuntu/Debian)
```bash
# VirtualBox
sudo apt install virtualbox

# Python
sudo apt install python3 python3-pip

# Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

---

## 📚 Documentación Completa

Para una guía paso a paso detallada, consulta:
- **[GUIA_INSTALACION.md](./GUIA_INSTALACION.md)** - Guía completa con capturas
- **[INSTRUCCIONES_MIKROTIK.md](./INSTRUCCIONES_MIKROTIK.md)** - Configuración de MikroTik
- **[INICIO_RAPIDO.md](./INICIO_RAPIDO.md)** - Inicio rápido del proyecto

---

## ✅ Checklist de Instalación

Marca cada paso cuando lo completes:

- [ ] VirtualBox instalado
- [ ] MikroTik CHR descargado (.vdi)
- [ ] VM de MikroTik creada y funcionando
- [ ] API de MikroTik habilitada
- [ ] IP de MikroTik anotada
- [ ] Python instalado y en PATH
- [ ] Node.js instalado
- [ ] Dependencias del backend instaladas
- [ ] Archivo .env configurado
- [ ] Dependencias del frontend instaladas
- [ ] Backend iniciado correctamente
- [ ] Frontend iniciado correctamente
- [ ] Login exitoso en la aplicación

---

## 🎯 Arquitectura del Sistema

```
┌─────────────────────────────────────────────┐
│           Ether Sentinel (Frontend)         │
│              React + Vite                   │
│         http://localhost:5173               │
└─────────────────┬───────────────────────────┘
                  │
                  │ API REST
                  ↓
┌─────────────────────────────────────────────┐
│        Backend API (Python + Flask)         │
│         http://localhost:3001               │
└─────────────────┬───────────────────────────┘
                  │
                  │ RouterOS API (Puerto 8728)
                  ↓
┌─────────────────────────────────────────────┐
│      MikroTik CHR (VirtualBox VM)           │
│         Router Virtual                      │
│         192.168.x.x:8728                    │
└─────────────────────────────────────────────┘
```

---

## 💡 Consejos

### Para Desarrollo
- Usa `start-dev-python.bat` (Windows) para iniciar todo automáticamente
- Mantén las terminales abiertas para ver logs
- Usa `Ctrl+C` para detener los servidores

### Para Producción
- Cambia la `SECRET_KEY` en `.env`
- Cambia la contraseña del admin
- Usa contraseñas seguras en MikroTik
- Configura firewall en MikroTik

### Rendimiento
- Asigna al menos 1 GB de RAM a la VM de MikroTik
- Usa SSD para mejor rendimiento
- Cierra aplicaciones innecesarias

---

## 🐛 Problemas Comunes

### "Python no encontrado"
**Solución**: Reinstalar Python y marcar "Add to PATH"

### "No se puede conectar a MikroTik"
**Solución**: 
1. Verificar que la VM esté encendida
2. Verificar la IP en `.env`
3. Hacer ping: `ping 192.168.x.x`

### "Puerto 3001 ocupado"
**Solución**: Cambiar puerto en `.env` o cerrar la aplicación que lo usa

### "npm install falla"
**Solución**: 
1. Borrar `node_modules` y `package-lock.json`
2. Ejecutar `npm install` de nuevo

---

## 📞 Soporte

¿Necesitas ayuda?
1. Revisa la [Guía de Instalación Completa](./GUIA_INSTALACION.md)
2. Consulta la documentación oficial de cada herramienta
3. Verifica los logs del backend y frontend

---

¡Todo listo para comenzar con Ether Sentinel! 🎊
