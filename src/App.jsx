import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Landing       from './pages/Landing'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Dashboard     from './pages/Dashboard'
import Dispositivos  from './pages/Dispositivos'
import Horarios      from './pages/Horarios'
import Contenido     from './pages/Contenido'
import Configuracion from './pages/Configuracion'
import { getCurrentUser } from './lib/api'

/**
 * Componente para proteger rutas que requieren autenticación
 */
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null)
  
  useEffect(() => {
    // Verificar si el usuario está autenticado
    getCurrentUser()
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
  }, [])
  
  // Mientras verifica, mostrar nada (o un loader)
  if (isAuthenticated === null) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Cargando...
    </div>
  }
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  // Si está autenticado, mostrar el contenido
  return children
}

/**
 * Layout principal con sidebar fijo.
 * Solo se muestra cuando el usuario está autenticado (rutas protegidas).
 */
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Ruta principal - Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas con layout */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><Dashboard /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/dispositivos" element={
          <ProtectedRoute>
            <AppLayout><Dispositivos /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/horarios" element={
          <ProtectedRoute>
            <AppLayout><Horarios /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/contenido" element={
          <ProtectedRoute>
            <AppLayout><Contenido /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/configuracion" element={
          <ProtectedRoute>
            <AppLayout><Configuracion /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
