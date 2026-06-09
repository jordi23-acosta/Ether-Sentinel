import { useState } from 'react'
import Topbar from '../components/Topbar'
import { Link2, ShieldCheck, Trash2, Plus } from 'lucide-react'
import { blockedDomains as initBlocked, allowedDomains as initAllowed } from '../data/mockData'

export default function Contenido() {
  const [blocked, setBlocked]   = useState(initBlocked)
  const [allowed, setAllowed]   = useState(initAllowed)
  const [newBlocked, setNewBlocked] = useState('')
  const [newAllowed, setNewAllowed] = useState('')

  // Filtros avanzados
  const [filters, setFilters] = useState({
    phishing: true,
    malware:  true,
    ads:      false,
  })

  const addDomain = (list, setList, input, setInput) => {
    const val = input.trim().toLowerCase()
    if (val && !list.includes(val)) {
      setList(prev => [...prev, val])
    }
    setInput('')
  }

  const removeDomain = (list, setList, domain) => {
    setList(prev => prev.filter(d => d !== domain))
  }

  return (
    <>
      <Topbar searchPlaceholder="Buscar dominios..." />
      <div className="page-body">

        {/* Encabezado */}
        <div className="page-header">
          <h1>Bloquear <span>Sitios Web</span></h1>
          <p style={{ fontSize: 16 }}>Aquí puedes bloquear sitios web para que nadie pueda entrar. Por ejemplo: facebook.com, tiktok.com, etc.</p>
        </div>

        {/* Lista de dominios bloqueados - más simple */}
        <div className="card p-5" style={{ marginBottom: 20 }}>
          <div className="flex justify-between items-center mb-4">
            <strong style={{ fontSize: 18, color: '#F1F5F9' }}>🚫 Sitios Bloqueados</strong>
            <span style={{ 
              background: 'rgba(239, 68, 68, 0.2)', 
              color: '#FCA5A5', 
              padding: '6px 16px', 
              borderRadius: 20, 
              fontSize: 13, 
              fontWeight: 700,
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}>
              BLOQUEADOS
            </span>
          </div>

          {/* Input para añadir - más grande */}
          <div className="flex gap-3 mb-4">
            <input
              className="input"
              placeholder="Escribe el sitio web (ej: facebook.com)"
              value={newBlocked}
              onChange={e => setNewBlocked(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addDomain(blocked, setBlocked, newBlocked, setNewBlocked)}
              style={{ fontSize: 16, padding: '14px 16px' }}
            />
            <button
              className="btn btn-primary"
              onClick={() => addDomain(blocked, setBlocked, newBlocked, setNewBlocked)}
              style={{ padding: '14px 28px', fontSize: 16, fontWeight: 700 }}
            >
              🚫 Bloquear
            </button>
          </div>

          {/* Lista - más simple */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {blocked.map(domain => (
              <div key={domain} style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s'
              }}>
                <div className="flex items-center gap-3">
                  <span style={{ fontSize: 24 }}>🚫</span>
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#FCA5A5' }}>{domain}</span>
                </div>
                <button
                  onClick={() => removeDomain(blocked, setBlocked, domain)}
                  style={{
                    background: '#DC2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#B91C1C'}
                  onMouseOut={e => e.currentTarget.style.background = '#DC2626'}
                >
                  Eliminar
                </button>
              </div>
            ))}

            {blocked.length === 0 && (
              <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: 15, padding: '30px 0' }}>
                No hay sitios bloqueados. Escribe uno arriba para bloquearlo.
              </p>
            )}
          </div>
        </div>

        {/* Filtrado avanzado - simplificado */}
        <div className="card p-5">
          <strong style={{ fontSize: 18, display: 'block', marginBottom: 4, color: '#F1F5F9' }}>⚡ Protección Automática</strong>
          <p style={{ color: '#94A3B8', fontSize: 14, marginBottom: 20 }}>
            Activa estas opciones para bloquear automáticamente sitios peligrosos.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { key: 'phishing', label: '🎣 Bloquear sitios de estafa (Phishing)', desc: 'Sitios que intentan robar contraseñas' },
              { key: 'malware',  label: '🦠 Bloquear virus y malware', desc: 'Sitios que infectan tu computadora' },
              { key: 'ads',      label: '📢 Bloquear anuncios', desc: 'Bloquea publicidad molesta' },
            ].map(({ key, label, desc }) => (
              <label key={key} style={{
                background: filters[key] ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.3)',
                border: `2px solid ${filters[key] ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: 12,
                padding: '16px 20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                transition: 'all 0.3s'
              }}>
                <input
                  type="checkbox"
                  checked={filters[key]}
                  onChange={e => setFilters(prev => ({ ...prev, [key]: e.target.checked }))}
                  style={{ width: 24, height: 24, cursor: 'pointer', accentColor: '#3B82F6' }}
                />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2, color: '#F1F5F9' }}>{label}</div>
                  <div style={{ fontSize: 13, color: '#94A3B8' }}>{desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

      </div>
    </>
  )
}
