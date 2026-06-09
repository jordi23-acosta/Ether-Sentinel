# 📸 Cómo Agregar Captura del Dashboard

## 🎯 Mockup de Navegador Creado

Se ha creado un **mockup de navegador estilo macOS** en la landing page para mostrar una captura de pantalla o video del dashboard.

---

## 📁 Dónde Guardar la Imagen

### Opción 1: Captura de Pantalla

1. **Tomar captura del dashboard**
   - Iniciar sesión en Ether Sentinel
   - Ir al Dashboard
   - Tomar captura de pantalla (Windows: Win+Shift+S)

2. **Guardar la imagen**
   ```
   Ubicación: public/images/dashboard-preview.png
   ```

3. **Especificaciones recomendadas**
   - Formato: PNG o JPG
   - Tamaño: 1200x800 px (o similar 3:2)
   - Peso: Menos de 500 KB
   - Calidad: Alta

### Opción 2: Video/GIF

Si prefieres un video o GIF animado:

1. **Grabar el dashboard**
   - Usar herramienta de grabación (OBS, ScreenToGif, etc.)
   - Mostrar las funcionalidades principales

2. **Guardar el archivo**
   ```
   Ubicación: public/images/dashboard-preview.gif
   o
   Ubicación: public/videos/dashboard-demo.mp4
   ```

---

## 🎨 Diseño del Mockup

El mockup incluye:

```
┌─────────────────────────────────────────┐
│ 🔴 🟡 🟢  🔒 localhost:5173/dashboard  │ ← Header estilo macOS
├─────────────────────────────────────────┤
│                                         │
│     [TU CAPTURA AQUÍ]                   │
│                                         │
│     O                                   │
│                                         │
│     [Placeholder con iconos]            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 Configuración Actual

### Si TIENES la imagen:

La imagen se mostrará automáticamente si está en:
```
public/images/dashboard-preview.png
```

### Si NO TIENES la imagen:

Se mostrará un **placeholder** con:
- Icono de escudo
- Título: "Dashboard de Ether Sentinel"
- Descripción: "Control total de tu red en tiempo real"
- 3 estadísticas (Ilimitados, 24/7, 100%)

---

## 📝 Pasos para Agregar tu Captura

### Paso 1: Tomar la Captura

```bash
1. Iniciar Ether Sentinel
2. Ir al Dashboard (http://localhost:5173/dashboard)
3. Tomar captura de pantalla
4. Guardar como "dashboard-preview.png"
```

### Paso 2: Optimizar la Imagen (Opcional)

Puedes usar herramientas online para optimizar:
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/

### Paso 3: Guardar en la Carpeta

```
Copiar dashboard-preview.png a:
c:\Users\axelr\sistema acceso\ether-sentinel\public\images\
```

### Paso 4: Recargar la Página

```
http://localhost:5173/
```

¡La imagen aparecerá automáticamente en el mockup!

---

## 🎬 Si Prefieres Video

### Usar Video en lugar de Imagen

Editar `src/pages/Landing.jsx`:

```jsx
<div className="browser-content">
  <video 
    autoPlay 
    loop 
    muted 
    playsInline
    className="dashboard-preview"
  >
    <source src="/videos/dashboard-demo.mp4" type="video/mp4" />
  </video>
</div>
```

Guardar el video en:
```
public/videos/dashboard-demo.mp4
```

---

## 💡 Consejos para la Captura

### Qué Mostrar:

✅ Dashboard con datos reales  
✅ Gráficas y estadísticas visibles  
✅ Dispositivos conectados  
✅ Interfaz limpia y organizada  

### Qué Evitar:

❌ Información personal o sensible  
❌ IPs reales (puedes difuminarlas)  
❌ Contraseñas visibles  
❌ Datos de clientes reales  

### Mejores Prácticas:

1. **Usar datos de prueba** para la captura
2. **Mostrar el estado "activo"** del sistema
3. **Incluir varios dispositivos** para que se vea completo
4. **Capturar en resolución alta** (1920x1080 o superior)
5. **Recortar** para enfocarse en el contenido importante

---

## 🎨 Personalizar el Mockup

### Cambiar el Color de los Dots

En `src/index.css`:

```css
.dot-red {
  background: #FF5F57;  /* Cambiar aquí */
}
```

### Cambiar la URL en la Barra

En `src/pages/Landing.jsx`:

```jsx
<span className="address-bar-text">
  tu-dominio.com/dashboard  {/* Cambiar aquí */}
</span>
```

### Ajustar el Tamaño

En `src/index.css`:

```css
.browser-mockup {
  max-width: 600px;  /* Cambiar aquí */
}

.browser-content {
  min-height: 400px;  /* Cambiar aquí */
}
```

---

## 🖼️ Alternativas sin Captura

Si no quieres usar una captura real, puedes:

1. **Usar el placeholder actual** (ya está configurado)
2. **Crear un mockup en Figma/Canva**
3. **Usar una ilustración** del dashboard
4. **Generar con IA** (Midjourney, DALL-E)

---

## 📞 Resultado Final

Con la captura, el mockup se verá así:

```
┌─────────────────────────────────────────┐
│ 🔴 🟡 🟢  🔒 localhost:5173/dashboard  │
├─────────────────────────────────────────┤
│                                         │
│  [CAPTURA DEL DASHBOARD REAL]           │
│  - Gráficas de tráfico                  │
│  - Lista de dispositivos                │
│  - Estadísticas en tiempo real          │
│                                         │
└─────────────────────────────────────────┘
```

¡Se verá súper profesional! 🎨✨

---

## ✅ Checklist

- [ ] Tomar captura del dashboard
- [ ] Optimizar la imagen (opcional)
- [ ] Guardar como `dashboard-preview.png`
- [ ] Copiar a `public/images/`
- [ ] Recargar la landing page
- [ ] Verificar que se vea bien
- [ ] Ajustar tamaño si es necesario

---

¡Listo para agregar tu captura! 📸
