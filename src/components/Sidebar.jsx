import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Monitor, Calendar, Shield, Settings, Plus } from 'lucide-react';

// Sidebar fijo con navegación principal
const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
  { to: '/dispositivos', icon: Monitor, label: 'Dispositivos' },
  { to: '/horarios', icon: Calendar, label: 'Horario' },
  { to: '/contenido', icon: Shield, label: 'Contenido' },
  { to: '/configuracion', icon: Settings, label: 'Configuración' },
];

export default function Sidebar() {
  return (
    <aside style={{
      width: '220px', minHeight: '100vh', background: 'white',
      borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column',
      padding: '24px 0', position: 'fixed', top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: '0 20px 28px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#2563eb', borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>Ether Sentinel</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Curador de Red</div>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', marginBottom: '4px',
              textDecoration: 'none', fontSize: '14px', fontWeight: isActive ? 600 : 400,
              color: isActive ? '#2563eb' : '#64748b',
              background: isActive ? '#eff6ff' : 'transparent',
              transition: 'all 0.15s',
            })}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Botón añadir dispositivo */}
      <div style={{ padding: '0 12px 16px' }}>
        <button style={{
          width: '100%', padding: '10px', background: '#2563eb', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
          fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
          <Plus size={16} /> Añadir Dispositivo
        </button>
      </div>

      {/* Perfil */}
      <div style={{
        padding: '12px 16px', borderTop: '1px solid #f1f5f9',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', background: '#e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
        }}>👤</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>Perfil de Admin</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Curador de Red</div>
        </div>
      </div>
    </aside>
  );
}
