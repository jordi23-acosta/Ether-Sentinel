import { useState } from 'react';
import { Search, Filter, Download, Wifi, Network, MoreVertical } from 'lucide-react';
import Topbar from '../components/Topbar';
import { dispositivosMock } from '../data/mockData';

export default function Dispositivos() {
  const [dispositivos, setDispositivos] = useState(dispositivosMock);
  const [busqueda, setBusqueda] = useState('');

  // Alternar estado bloqueado/activo
  const toggleEstado = (id) => {
    setDispositivos(prev =>
      prev.map(d => d.id === id ? { ...d, estado: !d.estado } : d)
    );
  };

  const filtrados = dispositivos.filter(d =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.ip.includes(busqueda) ||
    d.mac.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <Topbar placeholder="Buscar dispositivos por nombre, IP o MAC..." />
      <div style={{ padding: '28px' }}>
        {/* Encabezado */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>
            Registro de <span style={{ color: '#2563eb' }}>Dispositivos</span>
          </h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>
            Configure y supervise los puntos de conexión activos en su entorno de red.<br />
            Mantenga la integridad estructural gestionando el acceso de cada nodo.
          </p>
        </div>

        {/* Barra de búsqueda y acciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              placeholder="Buscar dispositivos por nombre, IP o MAC..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 36px', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontSize: '14px', outline: 'none', background: 'white',
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
              border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white',
              cursor: 'pointer', fontSize: '13px', color: '#475569',
            }}>
              <Filter size={15} /> Filtros
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
              border: '1px solid #e2e8f0', borderRadius: '8px', background: 'white',
              cursor: 'pointer', fontSize: '13px', color: '#475569',
            }}>
              <Download size={15} /> Exportar
            </button>
          </div>
        </div>

        {/* Tabla de dispositivos */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Nombre del Dispositivo', 'Dirección IP', 'Dirección MAC', 'Tipo', 'Estado', 'Acciones'].map(col => (
                  <th key={col} style={{
                    padding: '12px 20px', textAlign: 'left', fontSize: '11px',
                    fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((d, i) => (
                <tr key={d.id} style={{ borderBottom: i < filtrados.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  {/* Nombre */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: d.estado ? '#eff6ff' : '#fef2f2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                      }}>
                        {d.tipo.includes('Wi-Fi') ? '💻' : d.nombre.includes('iPhone') ? '📱' : d.nombre.includes('Laser') ? '🖨️' : '🖥️'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>{d.nombre}</div>
                        <div style={{ fontSize: '12px', color: d.estado ? '#94a3b8' : '#ef4444', fontWeight: d.estado ? 400 : 600 }}>
                          {d.visto}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* IP */}
                  <td style={{ padding: '16px 20px', fontSize: '14px', color: '#475569', fontFamily: 'monospace' }}>{d.ip}</td>
                  {/* MAC */}
                  <td style={{ padding: '16px 20px', fontSize: '13px', color: '#64748b', fontFamily: 'monospace' }}>{d.mac}</td>
                  {/* Tipo */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569' }}>
                      {d.tipo.includes('Wi-Fi') ? <Wifi size={14} color="#2563eb" /> : <Network size={14} color="#64748b" />}
                      {d.tipo}
                    </div>
                  </td>
                  {/* Estado con toggle */}
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label className="toggle">
                        <input type="checkbox" checked={d.estado} onChange={() => toggleEstado(d.id)} />
                        <span className="toggle-slider" />
                      </label>
                      <span style={{
                        fontSize: '12px', fontWeight: 700,
                        color: d.estado ? '#16a34a' : '#dc2626',
                      }}>
                        {d.estado ? 'ACTIVO' : 'BLOQUEADO'}
                      </span>
                    </div>
                  </td>
                  {/* Acciones */}
                  <td style={{ padding: '16px 20px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div style={{
            padding: '14px 20px', borderTop: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Mostrando {filtrados.length} de {dispositivos.length} dispositivos registrados
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{
                padding: '7px 16px', border: '1px solid #e2e8f0', borderRadius: '6px',
                background: 'white', cursor: 'pointer', fontSize: '13px',
              }}>Anterior</button>
              <button style={{
                padding: '7px 16px', border: 'none', borderRadius: '6px',
                background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              }}>Siguiente</button>
            </div>
          </div>
        </div>

        {/* Tarjetas de métricas inferiores */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Tiempo Real</div>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>852 Mbps</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Carga de Red Agregada</div>
          </div>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#f97316', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Salud de Seguridad</div>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>99.8%</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Puntuación de Integridad de Paquetes</div>
          </div>
          <div style={{ flex: 1, background: '#2563eb', borderRadius: '12px', padding: '20px', color: 'white' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', opacity: 0.8 }}>Guardián</div>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>3 Sondas</div>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Escaneos activos en progreso</div>
          </div>
        </div>
      </div>
    </div>
  );
}
