# 📚 Guía Completa de Instalación - Ether Sentinel

Esta guía te llevará paso a paso por la instalación y configuración de todas las herramientas necesarias para ejecutar Ether Sentinel.

---

## 📋 Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación de VirtualBox](#1-instalación-de-virtualbox)
3. [Instalación de MikroTik CHR](#2-instalación-de-mikrotik-chr)
4. [Configuración de MikroTik](#3-configuración-de-mikrotik)
5. [Instalación de Python](#4-instalación-de-python)
6. [Instalación de Node.js](#5-instalación-de-nodejs)
7. [Instalación de Ether Sentinel](#6-instalación-de-ether-sentinel)
8. [Primer Inicio](#7-primer-inicio)

---

## Requisitos del Sistema

### Hardware Mínimo
- **Procesador**: Intel Core i3 o equivalente
- **RAM**: 4 GB (8 GB recomendado)
- **Disco**: 20 GB de espacio libre
- **Red**: Conexión a internet

### Software Necesario
- ✅ VirtualBox 7.0 o superior
- ✅ MikroTik CHR (Cloud Hosted Router)
- ✅ Python 3.8 o superior
- ✅ Node.js 16.0 o superior

---

## 1. Instalación de VirtualBox

VirtualBox es necesario para ejecutar MikroTik CHR como máquina virtual.

### Windows

1. **Descargar VirtualBox**
   - Ir a: https://www.virtualbox.org/wiki/Downloads
   - Descargar "Windows hosts"
   - Archivo: `VirtualBox-7.x.x-Win.exe`

2. **Instalar**
   ```
   1. Ejecutar el instalador descargado
   2. Hacer clic en "Next" en todas las pantallas
   3. Aceptar la instalación de drivers de red
   4. Hacer clic en "Install"
   5. Esperar a que termine
   6. Hacer clic en "Finish"
   ```

3. **Verificar Instalación**
   - Abrir VirtualBox
   - Deberías ver la ventana principal de VirtualBox

### macOS

1. **Descargar VirtualBox**
   - Ir a: https://www.virtualbox.org/wiki/Downloads
   - Descargar "OS X hosts"
   - Archivo: `VirtualBox-7.x.x-OSX.dmg`

2. **Instalar**
   ```
   1. Abrir el archivo .dmg descargado
   2. Hacer doble clic en VirtualBox.pkg
   3. Seguir las instrucciones del instalador
   4. Permitir la extensión del sistema en Preferencias
   ```

### Linux (Ubuntu/Debian)

```bash
# Actualizar repositorios
sudo apt update

# Instalar VirtualBox
sudo apt install virtualbox virtualbox-ext-pack

# Verificar instalación
virtualbox --help
```

---

## 2. Instalación de MikroTik CHR

MikroTik CHR es el router virtual que controlará tu red.

### Descargar MikroTik CHR

1. **Ir al sitio oficial**
   - URL: https://mikrotik.com/download
   - Buscar "Cloud Hosted Router"

2. **Descargar la imagen VDI**
   - Seleccionar "CHR (Cloud Hosted Router)"
   - Descargar "VDI image" (para VirtualBox)
   - Archivo: `chr-x.xx.vdi`

### Crear la Máquina Virtual

1. **Abrir VirtualBox**

2. **Crear Nueva VM**
   ```
   1. Hacer clic en "Nueva" (New)
   2. Nombre: "MikroTik CHR"
   3. Tipo: Linux
   4. Versión: Other Linux (64-bit)
   5. Hacer clic en "Siguiente"
   ```

3. **Configurar Memoria RAM**
   ```
   - Asignar: 512 MB (mínimo) o 1024 MB (recomendado)
   - Hacer clic en "Siguiente"
   ```

4. **Configurar Disco Duro**
   ```
   1. Seleccionar "Usar un archivo de disco duro virtual existente"
   2. Hacer clic en el icono de carpeta
   3. Buscar y seleccionar el archivo chr-x.xx.vdi descargado
   4. Hacer clic en "Crear"
   ```

5. **Configurar Red**
   ```
   1. Seleccionar la VM "MikroTik CHR"
   2. Hacer clic en "Configuración"
   3. Ir a "Red"
   4. Adaptador 1:
      - Habilitar adaptador de red
      - Conectado a: "Adaptador puente" (Bridged Adapter)
      - Nombre: Seleccionar tu adaptador de red principal
   5. Hacer clic en "Aceptar"
   ```

6. **Iniciar la VM**
   ```
   1. Seleccionar "MikroTik CHR"
   2. Hacer clic en "Iniciar"
   3. Esperar a que cargue (verás el logo de MikroTik)
   ```

---

## 3. Configuración de MikroTik

### Primer Acceso

1. **Login en la consola**
   ```
   MikroTik Login: admin
   Password: [dejar en blanco, presionar Enter]
   ```

2. **Cambiar contraseña** (recomendado)
   ```
   [admin@MikroTik] > /user set admin password=TuContraseñaSegura
   ```

### Configurar IP Estática (Opcional)

```bash
# Ver interfaces disponibles
[admin@MikroTik] > /interface print

# Configurar IP en ether1
[admin@MikroTik] > /ip address add address=192.168.1.100/24 interface=ether1

# Configurar gateway
[admin@MikroTik] > /ip route add gateway=192.168.1.1
```

### Habilitar API

```bash
# Habilitar API en puerto 8728
[admin@MikroTik] > /ip service enable api

# Verificar que esté habilitado
[admin@MikroTik] > /ip service print
```

### Obtener IP del MikroTik

```bash
# Ver la IP asignada
[admin@MikroTik] > /ip address print
```

**Anota esta IP**, la necesitarás para configurar Ether Sentinel.

---

## 4. Instalación de Python

### Windows

1. **Descargar Python**
   - Ir a: https://www.python.org/downloads/
   - Descargar la última versión (3.11 o superior)
   - Archivo: `python-3.xx.x-amd64.exe`

2. **Instalar**
   ```
   1. Ejecutar el instalador
   2. ✅ IMPORTANTE: Marcar "Add Python to PATH"
   3. Hacer clic en "Install Now"
   4. Esperar a que termine
   5. Hacer clic en "Close"
   ```

3. **Verificar Instalación**
   ```bash
   # Abrir CMD o PowerShell
   python --version
   # Debería mostrar: Python 3.xx.x
   
   pip --version
   # Debería mostrar la versión de pip
   ```

### macOS

```bash
# Instalar Homebrew (si no lo tienes)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Python
brew install python

# Verificar
python3 --version
pip3 --version
```

### Linux (Ubuntu/Debian)

```bash
# Actualizar repositorios
sudo apt update

# Instalar Python y pip
sudo apt install python3 python3-pip

# Verificar
python3 --version
pip3 --version
```

---

## 5. Instalación de Node.js

### Windows

1. **Descargar Node.js**
   - Ir a: https://nodejs.org/
   - Descargar "LTS" (versión recomendada)
   - Archivo: `node-vxx.xx.x-x64.msi`

2. **Instalar**
   ```
   1. Ejecutar el instalador
   2. Hacer clic en "Next" en todas las pantallas
   3. Aceptar los términos
   4. Hacer clic en "Install"
   5. Hacer clic en "Finish"
   ```

3. **Verificar Instalación**
   ```bash
   # Abrir CMD o PowerShell
   node --version
   # Debería mostrar: v18.xx.x o superior
   
   npm --version
   # Debería mostrar la versión de npm
   ```

### macOS

```bash
# Con Homebrew
brew install node

# Verificar
node --version
npm --version
```

### Linux (Ubuntu/Debian)

```bash
# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar
node --version
npm --version
```

---

## 6. Instalación de Ether Sentinel

### Descargar el Proyecto

```bash
# Opción 1: Clonar desde Git (si está en GitHub)
git clone https://github.com/tu-usuario/ether-sentinel.git
cd ether-sentinel

# Opción 2: Descargar ZIP
# 1. Descargar el archivo ZIP del proyecto
# 2. Extraer en una carpeta
# 3. Abrir terminal en esa carpeta
```

### Configurar Backend (Python)

```bash
# Ir a la carpeta del backend
cd backend-python

# Instalar dependencias
pip install -r requirements.txt

# Crear archivo .env
# Windows:
copy .env.example .env

# Linux/macOS:
cp .env.example .env

# Editar .env con tu editor favorito
notepad .env  # Windows
nano .env     # Linux/macOS
```

**Configurar el archivo `.env`:**

```env
# IP del MikroTik (la que anotaste antes)
MIKROTIK_HOST=192.168.1.100

# Puerto de la API (por defecto 8728)
MIKROTIK_PORT=8728

# Usuario de MikroTik
MIKROTIK_USER=admin

# Contraseña de MikroTik
MIKROTIK_PASSWORD=TuContraseñaSegura

# Puerto del backend
PORT=3001

# Clave secreta (cambiar en producción)
SECRET_KEY=ether-sentinel-super-secret-key-change-me
```

### Configurar Frontend (React)

```bash
# Volver a la raíz del proyecto
cd ..

# Instalar dependencias
npm install
```

---

## 7. Primer Inicio

### Iniciar Backend

```bash
# En una terminal, ir a backend-python
cd backend-python

# Iniciar el servidor
python app.py

# Deberías ver:
# ✅ Usuario admin creado (admin/admin123)
# 🚀 Backend corriendo en http://localhost:3001
# 📡 MikroTik: 192.168.1.100:8728
```

### Iniciar Frontend

```bash
# En OTRA terminal, en la raíz del proyecto
npm run dev

# Deberías ver:
# VITE v4.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
```

### Acceder a la Aplicación

1. **Abrir navegador**
   - Ir a: http://localhost:5173/

2. **Ver la Landing Page**
   - Deberías ver la página de presentación

3. **Iniciar Sesión**
   - Hacer clic en "Iniciar Sesión"
   - Usuario: `admin`
   - Contraseña: `admin123`

4. **¡Listo!**
   - Deberías estar en el Dashboard
   - Verás los dispositivos conectados a tu red

---

## 🎉 ¡Instalación Completada!

Ahora tienes Ether Sentinel funcionando completamente. Puedes:

- ✅ Ver dispositivos conectados
- ✅ Bloquear/desbloquear dispositivos
- ✅ Configurar horarios de acceso
- ✅ Filtrar contenido
- ✅ Monitorear tu red en tiempo real

---

## 🐛 Solución de Problemas

### Backend no se conecta a MikroTik

**Error**: `Failed to connect to MikroTik`

**Solución**:
1. Verificar que la VM de MikroTik esté encendida
2. Verificar la IP en el archivo `.env`
3. Verificar que la API esté habilitada en MikroTik
4. Hacer ping al MikroTik: `ping 192.168.1.100`

### Frontend no carga

**Error**: `Cannot GET /`

**Solución**:
1. Verificar que Node.js esté instalado: `node --version`
2. Instalar dependencias: `npm install`
3. Iniciar de nuevo: `npm run dev`

### Python no encontrado

**Error**: `python: command not found`

**Solución**:
- Windows: Reinstalar Python y marcar "Add to PATH"
- Linux/macOS: Usar `python3` en lugar de `python`

### Puerto ocupado

**Error**: `Port 3001 is already in use`

**Solución**:
1. Cerrar otras aplicaciones que usen el puerto
2. O cambiar el puerto en `.env`: `PORT=3002`

---

## 📞 Soporte

Si tienes problemas:

1. Revisar esta guía completa
2. Verificar los logs del backend y frontend
3. Consultar la documentación de cada herramienta
4. Buscar en los issues del proyecto (si está en GitHub)

---

## 📚 Documentación Adicional

- [VirtualBox Manual](https://www.virtualbox.org/manual/)
- [MikroTik Wiki](https://wiki.mikrotik.com/)
- [Python Documentation](https://docs.python.org/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

¡Disfruta usando Ether Sentinel! 🎊
