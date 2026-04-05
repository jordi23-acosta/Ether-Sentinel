import { useState } from 'react';
import { Monitor, ArrowUp, ArrowDown, ShieldOff, RefreshCw } from 'lucide-react';
import Topbar from '../components/Topbar';
import { actividadReciente } from '../data/mockData';

// Componente de tarjeta de estadística
function StatCard({ label, value, sub, badge, badgeColor }) {
  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '24px',
      flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <Monitor size={22} color="#94a3b8" />
        {badge && (
          <span style={{
            background: badgeColor || '#f0fdf4', color: badgeColor ? 'white' : '#16a34a',
            padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 500,
          }}>{badge}</span>
        )}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>{value}</div>
      {sub && <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{sub}</div>}
    </div>
  );
}

// Gráfico de barras simple simulado
function BarChart() {
  const data = [30, 45, 35, 60, 55, 70, 50, 80, 65, 90, 75, 60];
  const labels = ['12:00 AM', '', '', '06:00 AM', '', '', '12:00 PM', '', '', '06:00 PM', '', 'ACTUAL'];
  const max = Math.max(...data);

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', padding: '0 4px' }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{
            width: '100%', background: i === data.length - 1 ? '#2563eb' : '#bfdbfe',
            borderRadius: '4px 4px 0 0', height: `${(val / max) * 100}%`,
            transition: 'height 0.3s',
          }} />
          {labels[i] && <span style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [redActiva, setRedActiva] = useState(true);

  return (
    <div>
      <Topbar placeholder="Buscar dispositivos..." />
      <div style={{ padding: '28px' }}>
        {/* Encabezado */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>
            La red está <span style={{ color: '#2563eb' }}>protegida.</span>
          </h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>
            Orquestación en tiempo real activa en 4 nodos. Todos los protocolos de seguridad se encuentran dentro de los umbrales operativos.
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <StatCard label="Total de Dispositivos" value="24 / 32 Capacidad" badge="+2 Hoy" />
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '22px' }}>📡</span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>Óptimo</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Ancho de Banda</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '12px' }}><ArrowUp size={12} /> Subida</div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>12.4 <span style={{ fontSize: '14px', fontWeight: 400 }}>Mbps</span></div>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#3b82f6', fontSize: '12px' }}><ArrowDown size={12} /> Bajada</div>
                <div style={{ fontSize: '22px', fontWeight: 700 }}>142.8 <span style={{ fontSize: '14px', fontWeight: 400 }}>Mbps</span></div>
              </div>
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <ShieldOff size={22} color="#ef4444" />
              <span style={{ background: '#fef2f2', color: '#dc2626', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>Filtrado</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Sitios Bloqueados Hoy</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>1,204</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Amenazas Neutralizadas</div>
          </div>
        </div>

        {/* Estado de red + Gráfico */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {/* Card estado */}
          <div style={{
            background: 'white', borderRadius: '12px', padding: '28px', flex: '0 0 340px',
            border: '2px solid #2563eb', boxShadow: '0 4px 16px rgba(37,99,235,0.12)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '10px', height: '10px', background: redActiva ? '#22c55e' : '#ef4444', borderRadius: '50%', display: 'inline-block' }} />
                <span style={{ fontWeight: 700, fontSize: '18px' }}>Estado de la Red:</span>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={redActiva} onChange={() => setRedActiva(!redActiva)} />
                <span className="toggle-slider" />
              </label>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: redActiva ? '#16a34a' : '#dc2626', marginBottom: '12px' }}>
              {redActiva ? 'EN LÍNEA' : 'FUERA DE LÍNEA'}
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
              El cortafuegos Gatekeeper está activo. El tráfico externo se analiza en busca de firmas maliciosas. Último ping: 14ms.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={{
                padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
              }}>
                Ejecutar Diagnóstico
              </button>
              <button style={{
                padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer',
              }}>
                <RefreshCw size={16} color="#64748b" />
              </button>
            </div>
          </div>

          {/* Gráfico */}
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>Uso de Red</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Últimas 24 Horas</div>
              </div>
              <select style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '4px 8px', fontSize: '13px', outline: 'none' }}>
                <option>Tráfico Total</option>
                <option>Subida</option>
                <option>Bajada</option>
              </select>
            </div>
            <BarChart />
          </div>
        </div>

        {/* Actividad reciente */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: 600, fontSize: '16px' }}>Actividad de Acceso Reciente</h3>
            <a href="#" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none' }}>Ver Registro de Seguridad ↗</a>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {actividadReciente.map((item) => (
              <div key={item.id} style={{
                flex: 1, background: '#f8fafc', borderRadius: '10px', padding: '16px',
                display: 'flex', alignItems: 'center', gap: '12px',
              }}>
                <div style={{ fontSize: '28px' }}>{item.icono}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.nombre}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{item.tiempo}</div>
                </div>
                <span style={{
                  background: '#dbeafe', color: '#2563eb', padding: '2px 8px',
                  borderRadius: '4px', fontSize: '11px', fontWeight: 600,
                }}>{item.tipo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
