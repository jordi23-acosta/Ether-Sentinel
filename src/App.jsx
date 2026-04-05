import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Dispositivos from './pages/Dispositivos';
import Horarios from './pages/Horarios';
import Contenido from './pages/Contenido';
import Configuracion from './pages/Configuracion';
import Sidebar from './components/Sidebar';

// Layout con sidebar para las páginas internas
function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: '220px', flex: 1, minHeight: '100vh', background: '#f0f2f5' }}>
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz redirige al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Rutas protegidas con sidebar */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/dispositivos" element={<AppLayout><Dispositivos /></AppLayout>} />
        <Route path="/horarios" element={<AppLayout><Horarios /></AppLayout>} />
        <Route path="/contenido" element={<AppLayout><Contenido /></AppLayout>} />
        <Route path="/configuracion" element={<AppLayout><Configuracion /></AppLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
