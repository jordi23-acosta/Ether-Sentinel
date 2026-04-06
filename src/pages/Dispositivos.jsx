import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Download, MoreVertical, RefreshCw, AlertCircle, Pencil, Check, X } from 'lucide-react';
import Topbar from '../components/Topbar';

const API = 'http://localhost:3001';

// Celda de nombre editable inline
function NombreEditable({ dispositivo, onGuardar }) {
  const [editando, setEditando] = useState(false);
  const [valor, setValor] = useState(dispositivo.nombre);

  const guardar = async () => {
    const nombre = valor.trim();
    if (!nombre) { setValor(dispositivo.nombre); setEditando(false); return; }
    try {
      await fetch(`${API}/api/dispositivos/${dispositivo.ip}/nombre`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      });
      onGuardar(dispositivo.ip, nombre);
    } catch { /* fallback local */ onGuardar(dispositivo.ip, nombre); }
    setEditando(false);
  };

  const cancelar = () => { setValor(dispositivo.nombre); setEditando(false); };

  if (editando) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <input
          autoFocus
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') guardar(); if (e.key === 'Escape') cancelar(); }}
          style={{
            padding: '4px 8px', border: '2px solid #2563eb', borderRadius: '6px',
            fontSize: '13px', outline: 'none', width: '160px',
          }}
        />
        <button onClick={guardar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a' }}>
          <Check size={15} />
        </button>
        <button onClick={cancelar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span style={{ fontWeight: 600, fontSize: '14px', color: '#1e293b' }}>{dispositivo.nombre}</span>
      <button
        onClick={() => { setValor(dispositivo.nombre); setEditando(true); }}
        title="Editar nombre"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#cbd5e1', padding: '2px' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#2563eb'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#cbd5e1'}
      >
        <Pencil size={13} />
      </button>
    </div>
  );
}

const API = 'http://localhost:3001';

export default function Dispositivos() {
  const [dispositivos, setDispositivos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [escaneando, setEscaneando] = useState(false);

  // Carga dispositivos desde el servidor real
  const cargarDispositivos = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/dispositivos`);
      if (!res.ok) throw new Error('Error al conectar con el servidor');
      const data = await res.json();
      setDispositivos(data);
    } catch (e) {
      setError('No se pudo conectar al servidor. Asegúrate de que está corriendo en el puerto 3001.');
    } finally {
      setCargando(false);
    }
  }, []);

  // Escanear red completa
  const escanearRed = async () => {
    setEscaneando(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/dispositivos`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDispositivos(data);
    } catch {
      setError('Error al escanear. Verifica que el servidor esté activo.');
    } finally {
      setEscaneando(false);
    }
  };

  // Bloquear / desbloquear dispositivo
  const toggleEstado = async (ip) => {
    try {
      const res = await fetch(`${API}/api/dispositivos/${ip}/toggle`, { method: 'POST' });
      const data = await res.json();
      setDispositivos(prev =>
        prev.map(d => d.ip === ip ? { ...d, estado: data.estado } : d)
      );
    } catch {
      // Si falla el servidor, toggle local como fallback
      setDispositivos(prev =>
        prev.map(d => d.ip === ip ? { ...d, estado: !d.estado } : d)
      );
    }
  };

  // Actualizar nombre localmente tras guardar
  const actualizarNombre = useCallback((ip, nombre) => {
    setDispositivos(prev => prev.map(d => d.ip === ip ? { ...d, nombre } : d));
  }, []);

  useEffect(() => {
    cargarDispositivos();
  }, [cargarDispositivos]);
    d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    d.ip.includes(busqueda) ||
    (d.mac && d.mac.toLowerCase().includes(busqueda.toLowerCase()))
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
            Dispositivos detectados en tu red local en tiempo real.
          </p>
        </div>

        {/* Banner de error si el servidor no está activo */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
            padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px',
          }}>
            <AlertCircle size={18} color="#dc2626" style={{ marginTop: '1px', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, color: '#dc2626', fontSize: '14px' }}>Servidor no disponible</div>
              <div style={{ color: '#7f1d1d', fontSize: '13px', marginTop: '2px' }}>{error}</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#991b1b', fontFamily: 'monospace', background: '#fee2e2', padding: '6px 10px', borderRadius: '6px', display: 'inline-block' }}>
                cd ether-sentinel/server &amp;&amp; node index.js
              </div>
            </div>
          </div>
        )}

        {/* Barra de búsqueda y acciones */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '480px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              placeholder="Buscar por nombre, IP o MAC..."
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
            <button
              onClick={escanearRed}
              disabled={escaneando}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px',
                border: 'none', borderRadius: '8px', background: '#2563eb', color: 'white',
                cursor: escaneando ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 600,
                opacity: escaneando ? 0.7 : 1,
              }}
            >
              <RefreshCw size={15} style={{ animation: escaneando ? 'spin 1s linear infinite' : 'none' }} />
              {escaneando ? 'Escaneando...' : 'Escanear Red'}
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

        {/* Tabla */}
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                {['Dispositivo', 'Marca / Tipo', 'Dirección IP', 'MAC', 'Estado', 'Acciones'].map(col => (
                  <th key={col} style={{
                    padding: '12px 20px', textAlign: 'left', fontSize: '11px',
                    fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px',
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔍</div>
                    <div style={{ fontWeight: 600 }}>Escaneando la red...</div>
                    <div style={{ fontSize: '13px', marginTop: '4px' }}>Esto puede tardar hasta 30 segundos</div>
                  </td>
                </tr>
              ) : filtrados.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>📡</div>
                    <div style={{ fontWeight: 600 }}>No se encontraron dispositivos</div>
                    <div style={{ fontSize: '13px', marginTop: '4px' }}>Inicia el servidor y presiona "Escanear Red"</div>
                  </td>
                </tr>
              ) : (
                filtrados.map((d, i) => (
                  <tr key={d.ip} style={{ borderBottom: i < filtrados.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    {/* Icono + nombre editable */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: '10px',
                          background: d.estado ? '#eff6ff' : '#fef2f2',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                          flexShrink: 0,
                        }}>
                          {d.icono || '🖥️'}
                        </div>
                        <div>
                          <NombreEditable dispositivo={d} onGuardar={actualizarNombre} />
                          <div style={{ fontSize: '12px', color: d.estado ? '#94a3b8' : '#ef4444', fontWeight: d.estado ? 400 : 600 }}>
                            {d.visto}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Marca / Tipo */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{d.marca || '—'}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{d.tipo || '—'}</div>
                    </td>
                    {/* IP */}
                    <td style={{ padding: '14px 20px', fontSize: '13px', color: '#475569', fontFamily: 'monospace' }}>{d.ip}</td>
                    {/* MAC */}
                    <td style={{ padding: '14px 20px', fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>{d.mac}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label className="toggle">
                          <input type="checkbox" checked={d.estado} onChange={() => toggleEstado(d.ip)} />
                          <span className="toggle-slider" />
                        </label>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: d.estado ? '#16a34a' : '#dc2626' }}>
                          {d.estado ? 'ACTIVO' : 'BLOQUEADO'}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div style={{
            padding: '14px 20px', borderTop: '1px solid #f1f5f9',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {cargando ? 'Escaneando...' : `Mostrando ${filtrados.length} de ${dispositivos.length} dispositivos detectados`}
            </span>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '20px' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Detectados</div>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>{dispositivos.length}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Dispositivos en la red</div>
          </div>
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Activos</div>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>{dispositivos.filter(d => d.estado).length}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>Con acceso permitido</div>
          </div>
          <div style={{ flex: 1, background: '#2563eb', borderRadius: '12px', padding: '20px', color: 'white' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px', opacity: 0.8 }}>Bloqueados</div>
            <div style={{ fontSize: '28px', fontWeight: 800 }}>{dispositivos.filter(d => !d.estado).length}</div>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Sin acceso a la red</div>
          </div>
        </div>
      </div>

      {/* CSS para animación del spinner */}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
