import { useState, useRef, useEffect } from 'react';
import { Bell, Shield, Search, CheckCircle, AlertTriangle, Info, X, LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Notificaciones simuladas (en un sistema real vendrían del servidor)
const NOTIFICACIONES_INIT = [
  { id: 1, tipo: 'alerta',  titulo: 'Dispositivo bloqueado',      desc: 'Estación de Trabajo fue bloqueada por política.', tiempo: 'Hace 2 min',  leida: false },
  { id: 2, tipo: 'info',    titulo: 'Nuevo dispositivo detectado', desc: 'Se detectó un nuevo dispositivo en 192.168.1.88.', tiempo: 'Hace 15 min', leida: false },
  { id: 3, tipo: 'exito',   titulo: 'Escaneo completado',          desc: 'Red escaneada: 4 dispositivos activos encontrados.', tiempo: 'Hace 1h',   leida: true  },
  { id: 4, tipo: 'alerta',  titulo: 'Dominio bloqueado',           desc: 'Intento de acceso a facebook.com bloqueado.', tiempo: 'Hace 2h',    leida: true  },
];

const TIPO_ICONO = {
  alerta: <AlertTriangle size={15} color="#f97316" />,
  info:   <Info size={15} color="#2563eb" />,
  exito:  <CheckCircle size={15} color="#16a34a" />,
};

// Hook para cerrar dropdown al hacer clic fuera
function useClickOutside(ref, callback) {
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) callback(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, callback]);
}

export default function Topbar({ placeholder = 'Buscar...' }) {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState(NOTIFICACIONES_INIT);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showEscudo, setShowEscudo] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);

  const refNotifs  = useRef(null);
  const refEscudo  = useRef(null);
  const refPerfil  = useRef(null);

  useClickOutside(refNotifs, () => setShowNotifs(false));
  useClickOutside(refEscudo, () => setShowEscudo(false));
  useClickOutside(refPerfil, () => setShowPerfil(false));

  const noLeidas = notifs.filter(n => !n.leida).length;

  const marcarTodasLeidas = () => setNotifs(prev => prev.map(n => ({ ...n, leida: true })));
  const eliminarNotif = (id) => setNotifs(prev => prev.filter(n => n.id !== id));

  const handleLogout = () => navigate('/login');

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
          style={{ width: '100%', padding: '7px 12px 7px 32px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#f8fafc' }}
        />
      </div>

      {/* Iconos de acción */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* 🔔 Notificaciones */}
        <div ref={refNotifs} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowNotifs(v => !v); setShowEscudo(false); setShowPerfil(false); }}
            style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px', borderRadius: '8px', display: 'flex' }}
          >
            <Bell size={20} />
            {noLeidas > 0 && (
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', background: '#ef4444', borderRadius: '50%', fontSize: '10px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                {noLeidas}
              </span>
            )}
          </button>

          {showNotifs && (
            <div style={{ position: 'absolute', right: 0, top: '44px', width: '340px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 200 }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '14px' }}>Notificaciones</span>
                {noLeidas > 0 && (
                  <button onClick={marcarTodasLeidas} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#2563eb', fontWeight: 500 }}>
                    Marcar todas como leídas
                  </button>
                )}
              </div>
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifs.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>Sin notificaciones</div>
                ) : notifs.map(n => (
                  <div key={n.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f8fafc', background: n.leida ? 'white' : '#f0f7ff', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>{TIPO_ICONO[n.tipo]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{n.titulo}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{n.desc}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{n.tiempo}</div>
                    </div>
                    <button onClick={() => eliminarNotif(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', flexShrink: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 🛡️ Estado de seguridad */}
        <div ref={refEscudo} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowEscudo(v => !v); setShowNotifs(false); setShowPerfil(false); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', padding: '6px', borderRadius: '8px', display: 'flex' }}
          >
            <Shield size={20} />
          </button>

          {showEscudo && (
            <div style={{ position: 'absolute', right: 0, top: '44px', width: '260px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 200, padding: '16px' }}>
              <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={16} color="#16a34a" /> Estado de Seguridad
              </div>
              {[
                { label: 'Cortafuegos',       estado: 'Activo',    color: '#16a34a' },
                { label: 'Filtro DNS',         estado: 'Activo',    color: '#16a34a' },
                { label: 'Inspección DPI',     estado: 'Activo',    color: '#16a34a' },
                { label: 'VPN Obligatoria',    estado: 'Inactivo',  color: '#94a3b8' },
                { label: 'Modo Cuarentena',    estado: 'Inactivo',  color: '#94a3b8' },
              ].map(({ label, estado, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f8fafc' }}>
                  <span style={{ fontSize: '13px', color: '#475569' }}>{label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color }}>{estado}</span>
                </div>
              ))}
              <div style={{ marginTop: '12px', background: '#f0fdf4', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
                ✓ Sistema operando con normalidad
              </div>
            </div>
          )}
        </div>

        {/* 👤 Perfil */}
        <div ref={refPerfil} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowPerfil(v => !v); setShowNotifs(false); setShowEscudo(false); }}
            style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#e2e8f0', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}
          >
            👤
          </button>

          {showPerfil && (
            <div style={{ position: 'absolute', right: 0, top: '44px', width: '220px', background: 'white', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0', zIndex: 200, overflow: 'hidden' }}>
              {/* Info del usuario */}
              <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>👤</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>Perfil de Admin</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Curador de Red</div>
                </div>
              </div>
              {/* Opciones */}
              {[
                { icon: <User size={15} />,     label: 'Mi Perfil',       action: () => {} },
                { icon: <Settings size={15} />, label: 'Configuración',   action: () => { navigate('/configuracion'); setShowPerfil(false); } },
              ].map(({ icon, label, action }) => (
                <button key={label} onClick={action} style={{ width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#475569', textAlign: 'left' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  {icon} {label}
                </button>
              ))}
              <div style={{ borderTop: '1px solid #f1f5f9' }}>
                <button onClick={handleLogout} style={{ width: '100%', padding: '11px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#ef4444', textAlign: 'left' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                >
                  <LogOut size={15} /> Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
