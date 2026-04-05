import { useState } from 'react';
import { Link2, ShieldCheck, Trash2 } from 'lucide-react';
import Topbar from '../components/Topbar';
import { sitiosBloqueados, sitiosPermitidos } from '../data/mockData';

export default function Contenido() {
  const [bloqueados, setBloqueados] = useState(sitiosBloqueados);
  const [permitidos, setPermitidos] = useState(sitiosPermitidos);
  const [inputBloq, setInputBloq] = useState('');
  const [inputPerm, setInputPerm] = useState('');
  const [filtros, setFiltros] = useState({ phishing: true, malware: true, anuncios: false });

  const agregar = (lista, setLista, input, setInput) => {
    const val = input.trim().toLowerCase();
    if (val && !lista.includes(val)) {
      setLista(prev => [...prev, val]);
      setInput('');
    }
  };

  const eliminar = (lista, setLista, item) => {
    setLista(prev => prev.filter(d => d !== item));
  };

  return (
    <div>
      <Topbar placeholder="Buscar dominios..." />
      <div style={{ padding: '28px' }}>
        {/* Encabezado */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b' }}>Control de Contenido</h1>
          <p style={{ color: '#64748b', marginTop: '6px', fontSize: '14px' }}>
            Gestione las políticas de acceso a la red definiendo qué dominios están prohibidos y cuáles están permitidos explícitamente en toda la red de malla.
          </p>
        </div>

        {/* Listas de dominios */}
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

            {/* Input añadir */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                value={inputBloq}
                onChange={(e) => setInputBloq(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && agregar(bloqueados, setBloqueados, inputBloq, setInputBloq)}
                placeholder="ej. facebook.com"
                style={{
                  flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0',
                  borderRadius: '8px', fontSize: '14px', outline: 'none',
                }}
              />
              <button
                onClick={() => agregar(bloqueados, setBloqueados, inputBloq, setInputBloq)}
                style={{
                  padding: '10px 18px', background: '#2563eb', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                }}
              >
                Añadir
              </button>
            </div>

            {/* Lista */}
            {bloqueados.map((sitio) => (
              <div key={sitio} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', border: '1px solid #fee2e2', borderRadius: '8px', marginBottom: '8px',
                background: '#fff5f5',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link2 size={14} color="#ef4444" />
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>{sitio}</span>
                </div>
                <button
                  onClick={() => eliminar(bloqueados, setBloqueados, sitio)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
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

            {/* Input añadir */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input
                value={inputPerm}
                onChange={(e) => setInputPerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && agregar(permitidos, setPermitidos, inputPerm, setInputPerm)}
                placeholder="ej. microsoft.com"
                style={{
                  flex: 1, padding: '10px 12px', border: '1px solid #e2e8f0',
                  borderRadius: '8px', fontSize: '14px', outline: 'none',
                }}
              />
              <button
                onClick={() => agregar(permitidos, setPermitidos, inputPerm, setInputPerm)}
                style={{
                  padding: '10px 18px', background: '#2563eb', color: 'white',
                  border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px',
                }}
              >
                Añadir
              </button>
            </div>

            {/* Lista */}
            {permitidos.map((sitio) => (
              <div key={sitio} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', border: '1px solid #dbeafe', borderRadius: '8px', marginBottom: '8px',
                background: '#f0f7ff',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={14} color="#2563eb" />
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>{sitio}</span>
                </div>
                <button
                  onClick={() => eliminar(permitidos, setPermitidos, sitio)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
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
            Aplique filtrado basado en categorías utilizando nuestra base de datos de inteligencia de amenazas patentada para bloquear sectores enteros de actividad maliciosa.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { key: 'phishing', label: 'Protección contra Phishing' },
              { key: 'malware', label: 'Dominios de Malware' },
              { key: 'anuncios', label: 'Redes de Anuncios' },
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
