import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Monitor, Calendar, Shield, Settings, Plus, ShieldCheck, LogOut
} from 'lucide-react'
import { logout } from '../lib/api'

// Ítems del menú lateral
const navItems = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Panel de Control' },
  { to: '/dispositivos',  icon: Monitor,          label: 'Dispositivos' },
  { to: '/horarios',      icon: Calendar,         label: 'Horarios' },
  { to: '/contenido',     icon: Shield,           label: 'Contenido' },
  { to: '/configuracion', icon: Settings,         label: 'Configuración' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      await logout()
      localStorage.removeItem('ether_sentinel_user')
      navigate('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      // Redirigir de todas formas
      navigate('/login')
    }
  }
  
  return (
    <aside className="sidebar">
      {/* Marca */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          <ShieldCheck size={18} />
        </div>
        <div className="brand-text">
          <strong>Ether Sentinel</strong>
          <span>Curador de Red</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer con botón y perfil */}
      <div className="sidebar-footer">
        <button className="add-device-btn">
          <Plus size={14} />
          Añadir Dispositivo
        </button>
        <div className="user-profile">
          <div className="avatar">A</div>
          <div className="user-info">
            <strong>Perfil de Admin</strong>
            <span>Curador de Red</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="btn"
          style={{ 
            width: '100%', 
            marginTop: 8, 
            justifyContent: 'center',
            background: 'var(--red)',
            color: 'white',
            border: 'none'
          }}
        >
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
