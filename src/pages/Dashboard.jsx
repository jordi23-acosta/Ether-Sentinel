import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ShieldOff, RefreshCw } from 'lucide-react';
import Topbar from '../components/Topbar';

const API = 'http://localhost:3001';

// Gráfico de barras simple (datos simulados de tráfico)
function BarChart() {
  const data = [30, 45, 35, 60, 55, 70, 50, 80, 65, 90, 75, 60];
  const labels = ['12:00 AM', '', '', '06:00 AM', '', '', '12:00 PM', '', '', '06:00 PM', '', 'ACTUAL'];
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px', padding: '0 4px' }}>
      {data.map((val, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', background: i === data.length - 1 ? '#2563eb' : '#bfdbfe', borderRadius: '4px 4px 0 0', height: `${(val / max) * 100}%` }} />
          {labels[i] && <span style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [redActiva, setRedActiva] = useState(true);
  const [stats, setStats] = useState({
    totalDispositivos: 0,
    dispositivosActivos: 0,
    sitiosBloqueados: 0,
    cargando: true,
  });
  const [actividadReciente, setActividadReciente] = useState([]);

  // Cargar datos reales del servidor
  useEffect(() => {
    const cargar = async () => {
      try {
        // Dispositivos reales
        const [resRed, resContenido] = await Promise.all([
          fetch(`${API}/api/red`).catch(() => null),
          fetch(`${API}/api/contenido`).catch(() => null),
        ]);

        const redData = resRed?.ok ? await resRed.json() : null;
        const contenidoData = resContenido?.ok ? await resContenido.json() : null;

        setRedActiva(redData?.activa ?? true);
        setStats({
          totalDispositivos: 24,       // se actualiza al escanear
          dispositivosActivos: 24,
          sitiosBloqueados: contenidoData?.bloqueados?.length ?? 0,
          cargando: false,
        });
      } catch {
        setStats(s => ({ ...s, cargando: false }));
      }
    };

    // Cargar dispositivos recientes desde la API
    const cargarDispositivos = async () => {
      try {
        const res = await fetch(`${API}/api/dispositivos`);
        if (!res.ok) return;
        const data = await res.json();
        setStats(s => ({
          ...s,
          totalDispositivos: data.length,
          dispositivosActivos: data.filter(d => d.estado).length,
        }));
        // Tomar los 3 primeros como actividad reciente
        setActividadReciente(data.slice(0, 3).map(d => ({
          id: d.ip,
          nombre: d.nombre,
          tipo: d.tipo?.includes('Wi-Fi') ? 'WPA3' : 'ETH',
          tiempo: d.visto,
          icono: d.icono || '🖥️',
        })));
      } catch { /* servidor no disponible, usar datos mock */ }
    };

    cargar();
    cargarDispositivos();
  }, []);

  // Actividad mock si el servidor no responde
  const actividadMostrar = actividadReciente.length > 0 ? actividadReciente : [
    { id: 1, nombre: 'iPhone 15 Pro',   tipo: 'WPA3', tiempo: 'Conectado hace 2 min',  icono: '📱' },
    { id: 2, nombre: 'MacBook Pro M3',  tipo: 'ETH',  tiempo: 'Conectado hace 14 min', icono: '💻' },
    { id: 3, nombre: 'Televisor Salón', tipo: 'WIFI', tiempo: 'Conectado hace 1h',     icono: '📺' },
  ];

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
            Orquestación en tiempo real. Todos los protocolos de seguridad se encuentran dentro de los umbrales operativos.
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>

          {/* Dispositivos */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '22px' }}>🖥️</span>
              <span style={{ background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                {stats.cargando ? '...' : `${stats.dispositivosActivos} activos`}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Total de Dispositivos</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>
              {stats.cargando ? '—' : `${stats.totalDispositivos} / 32`}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Capacidad de la red</div>
          </div>

          {/* Ancho de banda */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
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

          {/* Sitios bloqueados */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <ShieldOff size={22} color="#ef4444" />
              <span style={{ background: '#fef2f2', color: '#dc2626', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>Filtrado</span>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Sitios Bloqueados</div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>
              {stats.cargando ? '—' : stats.sitiosBloqueados}
            </div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Dominios en lista negra</div>
          </div>
        </div>

        {/* Estado de red + Gráfico */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '28px', flex: '0 0 340px', border: '2px solid #2563eb', boxShadow: '0 4px 16px rgba(37,99,235,0.12)' }}>
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
              <button style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                Ejecutar Diagnóstico
              </button>
              <button style={{ padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                <RefreshCw size={16} color="#64748b" />
              </button>
            </div>
          </div>

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
            {actividadMostrar.map((item) => (
              <div key={item.id} style={{ flex: 1, background: '#f8fafc', borderRadius: '10px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '28px' }}>{item.icono}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.nombre}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{item.tiempo}</div>
                </div>
                <span style={{ background: '#dbeafe', color: '#2563eb', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                  {item.tipo}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
