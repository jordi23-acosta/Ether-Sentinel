import { Bell, Shield, Search } from 'lucide-react';

// Barra superior con estado de red, búsqueda e iconos de acción
export default function Topbar({ titulo, placeholder = 'Buscar...' }) {
  return (
    <header style={{
      height: '60px', background: 'white', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* Estado de red */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#f0fdf4', color: '#16a34a', padding: '4px 12px',
          borderRadius: '20px', fontSize: '13px', fontWeight: 500,
        }}>
          <span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
          Estado de la Red: Operativo
        </span>
      </div>

      {/* Búsqueda */}
      <div style={{ position: 'relative', flex: 1, maxWidth: '320px', margin: '0 24px' }}>
        <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          placeholder={placeholder}
          style={{
            width: '100%', padding: '7px 12px 7px 32px', border: '1px solid #e2e8f0',
            borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#f8fafc',
          }}
        />
      </div>

      {/* Iconos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <Bell size={20} />
        </button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
          <Shield size={20} />
        </button>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', cursor: 'pointer',
        }}>👤</div>
      </div>
    </header>
  );
}
