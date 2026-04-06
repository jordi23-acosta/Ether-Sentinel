import { useState, useEffect } from 'react';
import { Link2, ShieldCheck, Trash2, AlertCircle } from 'lucide-react';
import Topbar from '../components/Topbar';

const API = 'http://localhost:3001';

export default function Contenido() {
  const [bloqueados, setBloqueados] = useState([]);
  const [permitidos, setPermitidos] = useState([]);
  const [inputBloq, setInputBloq] = useState('');
  const [inputPerm, setInputPerm] = useState('');
  const [filtros, setFiltros] = useState({ phishing: true, malware: true, anuncios: false });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Cargar listas desde el servidor
  useEffect(() => {
    fetch(`${API}/api/contenido`)
      .then(r => r.json())
      .then(data => { setBloqueados(data.bloqueados || []); setPermitidos(data.permitidos || []); })
      .catch(() => setError('Servidor no disponible. Los cambios serán solo visuales.'));
  }, []);

  const agregarBloqueado = async () => {
    const val = inputBloq.trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, '');
    if (!val || bloqueados.includes(val)) return;
    setInputBloq('');
    setCargando(true);
    try {
      const res = await fetch(`${API}/api/contenido/bloquear`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dominio: val }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setBloqueados(prev => [...prev, val]); }
      else { setBloqueados(data.bloqueados); setError(''); }
    } catch { setBloqueados(prev => [...prev, val]); }
    finally { setCargando(false); }
  };

  const eliminarBloqueado = async (dominio) => {
    setBloqueados(prev => prev.filter(d => d !== dominio));
    try {
      await fetch(`${API}/api/contenido/bloquear/${encodeURIComponent(dominio)}`, { method: 'DELETE' });
    } catch { /* fallback visual ya aplicado */ }
  };

  const agregarPermitido = async () => {
    const val = inputPerm.trim().toLowerCase().replace(/^https?:\/\/(www\.)?/, '');
    if (!val || permitidos.includes(val)) return;
    setInputPerm('');
    try {
      const res = await fetch(`${API}/api/contenido/permitir`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dominio: val }),
      });
      const data = await res.json();
      setPermitidos(data.permitidos);
    } catch { setPermitidos(prev => [...prev, val]); }
  };

  const eliminarPermitido = async (dominio) => {
    setPermitidos(prev => prev.filter(d => d !== dominio));
    try {
      await fetch(`${API}/api/contenido/permitir/${encodeURIComponent(dominio)}`, { method: 'DELETE' });
    } catch { /* fallback visual */ }
  };

  return (
    <div>
      <Topbar placeholder="Buscar dominios..." />
      <div style={{ padding: '28px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>Control de Contenido</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>
            Gestione las políticas de acceso definiendo qué dominios están bloqueados o permitidos en la red.
          </p>
        </div>

        {/* Banner de error / advertencia de permisos */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <AlertCircle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div>
              <div style={{ fontWeight: 600, color: '#dc2626', fontSize: '14px' }}>Requiere permisos de administrador</div>
              <div style={{ color: '#7f1d1d', fontSize: '13px', marginTop: '2px' }}>{error}</div>
              <div style={{ marginTop: '8px', fontSize: '12px', color: '#991b1b' }}>
                Ejecuta el servidor como administrador: clic derecho en la terminal → "Ejecutar como administrador"
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '20px', marginBottom: '24px' }}>
          {/* Bloqueados */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', background: '#fef2f2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Link2 size={18} color="#ef4444" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>Dominios Bloqueados</span>
              </div>
              <span style={{ background: '#fef2f2', color: '#dc2626', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                RESTRINGIDO
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                value={inputBloq}
                onChange={(e) => setInputBloq(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && agregarBloqueado()}
                placeholder="ej. facebook.com"
                style={{ flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
              <button
                onClick={agregarBloqueado}
                disabled={cargando}
                style={{ padding: '10px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', opacity: cargando ? 0.7 : 1 }}
              >
                {cargando ? '...' : 'Añadir'}
              </button>
            </div>
            {bloqueados.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '13px' }}>
                No hay dominios bloqueados
              </div>
            )}
            {bloqueados.map((sitio) => (
              <div key={sitio} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: '1px solid #fee2e2', borderRadius: '8px', marginBottom: '8px', background: '#fff5f5' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link2 size={14} color="#ef4444" />
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>{sitio}</span>
                </div>
                <button onClick={() => eliminarBloqueado(sitio)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Permitidos */}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} color="#2563eb" />
                </div>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>Dominios Permitidos</span>
              </div>
              <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>
                PRIORIDAD
              </span>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                value={inputPerm}
                onChange={(e) => setInputPerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && agregarPermitido()}
                placeholder="ej. microsoft.com"
                style={{ flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
              <button
                onClick={agregarPermitido}
                style={{ padding: '10px 18px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
              >
                Añadir
              </button>
            </div>
            {permitidos.map((sitio) => (
              <div key={sitio} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', border: '1px solid #dbeafe', borderRadius: '8px', marginBottom: '8px', background: '#f0f7ff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={14} color="#2563eb" />
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>{sitio}</span>
                </div>
                <button onClick={() => eliminarPermitido(sitio)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Filtrado avanzado */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px' }}>Filtrado Avanzado</h3>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
            Bloquea categorías enteras de sitios con un solo clic.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { key: 'phishing', label: 'Protección contra Phishing', dominios: ['phishing.com', 'malware-site.net'] },
              { key: 'malware', label: 'Dominios de Malware', dominios: ['malware.com', 'virus-host.net'] },
              { key: 'anuncios', label: 'Redes de Anuncios', dominios: ['doubleclick.net', 'ads.google.com'] },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={filtros[key]}
                  onChange={() => setFiltros(prev => ({ ...prev, [key]: !prev[key] }))}
                  style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
                />
                {label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
