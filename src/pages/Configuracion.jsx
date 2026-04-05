import { useState } from 'react';
import { Power, Network, KeyRound, RefreshCw, Shield } from 'lucide-react';
import Topbar from '../components/Topbar';

export default function Configuracion() {
  const [sistemaActivo, setSistemaActivo] = useState(false);
  const [red, setRed] = useState({ gateway: '192.168.1.1', mascara: '255.255.255.0', dns1: '8.8.8.8', dns2: '1.1.1.1' });
  const [pass, setPass] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [guardado, setGuardado] = useState(false);

  const handleGuardar = () => {
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  return (
    <div>
      <Topbar placeholder="Buscar parámetros..." />
      <div style={{ padding: '28px' }}>
        {/* Encabezado */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>Configuración General</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>
            Configure los parámetros principales de su centinela y los protocolos de seguridad. Los cambios aquí afectan la orquestación global de la red.
          </p>
        </div>

        {/* Control del sistema */}
        <div style={{
          background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '20px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', background: '#fef2f2', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Power size={22} color="#ef4444" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '16px' }}>Control del Sistema</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Interruptor Maestro. Desactiva todo el tráfico de salida inmediatamente.</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>{sistemaActivo ? 'Activo' : 'Inactivo'}</span>
            <label className="toggle">
              <input type="checkbox" checked={sistemaActivo} onChange={() => setSistemaActivo(!sistemaActivo)} />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          {/* Ajustes de red */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Network size={18} color="#2563eb" />
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Ajustes de Red</span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Gestione los parámetros de enrutamiento IP y resolución de dominios.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'Puerta de Enlace', key: 'gateway' },
                { label: 'Máscara de Subred', key: 'mascara' },
                { label: 'DNS Primario', key: 'dns1' },
                { label: 'DNS Secundario', key: 'dns2' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                    {label}
                  </label>
                  <input
                    value={red[key]}
                    onChange={(e) => setRed(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
                      borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'monospace',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card integridad */}
          <div style={{ width: '240px', background: '#2563eb', borderRadius: '12px', padding: '24px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>Integridad de la Red</div>
              <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: '1.6' }}>
                Su configuración actual está optimizada para tráfico cifrado de alta capacidad y baja latencia.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
              <Shield size={14} />
              <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seguridad Empresarial</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
          {/* Credenciales */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KeyRound size={18} color="#475569" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Credenciales de Cuenta</span>
            </div>
            {[
              { label: 'Nueva Contraseña de Administrador', val: pass, set: setPass },
              { label: 'Confirmar Contraseña', val: passConfirm, set: setPassConfirm },
            ].map(({ label, val, set }) => (
              <div key={label} style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#475569', marginBottom: '6px' }}>{label}</label>
                <input
                  type="password"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0',
                    borderRadius: '8px', fontSize: '14px', outline: 'none',
                  }}
                />
              </div>
            ))}
            <a href="#" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>
              Actualizar Identidad →
            </a>
          </div>

          {/* Info del sistema */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontWeight: 700, fontSize: '16px' }}>Información del Sistema</span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                V4.2.0-STABLE
              </span>
            </div>
            {[
              { label: 'Versión del Kernel', val: '5.15.0-71-gen' },
              { label: 'Tiempo de Actividad', val: '14d 06h 12m' },
            ].map(({ label, val }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9', fontSize: '14px' }}>
                <span style={{ color: '#64748b' }}>{label}</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{val}</span>
              </div>
            ))}
            <button style={{
              width: '100%', marginTop: '20px', padding: '11px', border: '1px solid #e2e8f0',
              borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 500,
            }}>
              <RefreshCw size={16} /> Buscar Actualizaciones
            </button>
          </div>
        </div>

        {/* Acciones finales */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button style={{
            padding: '12px 24px', border: '1px solid #e2e8f0', borderRadius: '8px',
            background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
          }}>
            Descartar Cambios
          </button>
          <button
            onClick={handleGuardar}
            style={{
              padding: '12px 24px', background: guardado ? '#16a34a' : '#2563eb', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
              transition: 'background 0.3s',
            }}
          >
            {guardado ? '✓ Guardado' : 'Implementar Configuración'}
          </button>
        </div>
      </div>
    </div>
  );
}
