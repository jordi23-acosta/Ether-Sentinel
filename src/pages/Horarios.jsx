import { useState } from 'react'
import Topbar from '../components/Topbar'
import { Wand2, X, Plus } from 'lucide-react'
import { defaultSchedule } from '../data/mockData'

const DAYS    = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const HOURS   = Object.keys(defaultSchedule)

const PRESETS = [
  { label: 'Estándar de Oficina',  desc: 'Lun-Vie, 08:00 - 18:00' },
  { label: 'Seguridad Nocturna',   desc: '22:00 - 06:00, Bloqueo Total' },
  { label: 'Ventana de Invitados', desc: 'Solo Fines de Semana, 10:00 - 16:00' },
]

export default function Horarios() {
  const [schedule, setSchedule]   = useState(
    // Copia profunda del schedule inicial
    Object.fromEntries(HOURS.map(h => [h, [...defaultSchedule[h]]]))
  )
  const [exceptions, setExceptions] = useState(['CEO-Macbook', 'Servidor-Principal'])
  const [newException, setNewException] = useState('')
  const [deepInspect, setDeepInspect]   = useState(true)
  const [vpnForced, setVpnForced]       = useState(false)
  const [view, setView] = useState('Semanal') // Semanal | Mensual

  // Alterna una celda del horario
  const toggleCell = (hour, dayIdx) => {
    setSchedule(prev => {
      const row = [...prev[hour]]
      row[dayIdx] = !row[dayIdx]
      return { ...prev, [hour]: row }
    })
  }

  const addException = () => {
    if (newException.trim()) {
      setExceptions(prev => [...prev, newException.trim()])
      setNewException('')
    }
  }

  const removeException = (tag) => {
    setExceptions(prev => prev.filter(e => e !== tag))
  }

  // Cuenta celdas activas para el cálculo de eficiencia
  const activeCount = Object.values(schedule).flat().filter(Boolean).length
  const efficiency  = Math.round((activeCount / (HOURS.length * 7)) * 100)

  return (
    <>
      <Topbar searchPlaceholder="Buscar registros de red..." />
      <div className="page-body">

        {/* Encabezado */}
        <div className="page-header" style={{ marginBottom: 24 }}>
          <h1>Horario de <span>Acceso</span></h1>
          <p style={{ fontSize: 16 }}>Selecciona los días y horas en que quieres permitir el acceso a internet. Las celdas azules = permitido, las grises = bloqueado.</p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Panel izquierdo: grilla */}
          <div style={{ flex: 1 }}>
            <div className="card p-5">
              {/* Leyenda simple */}
              <div className="flex gap-4 items-center mb-4">
                <div className="flex items-center gap-2">
                  <span style={{ width: 20, height: 20, borderRadius: 4, background: 'var(--blue)', display: 'inline-block' }} />
                  <span style={{ fontSize: 15 }}>Permitido</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ width: 20, height: 20, borderRadius: 4, background: '#EFF6FF', border: '2px solid var(--blue-mid)', display: 'inline-block' }} />
                  <span style={{ fontSize: 15 }}>Bloqueado</span>
                </div>
              </div>

              {/* Grilla de horario - más grande */}
              <div className="schedule-grid" style={{ gap: 6 }}>
                {/* Fila de cabeceras */}
                <div className="schedule-cell header" style={{ height: 50 }} />
                {DAYS.map(d => (
                  <div key={d} className="schedule-cell header" style={{ height: 50, fontSize: 14 }}>{d}</div>
                ))}

                {/* Filas de horas */}
                {HOURS.map(hour => (
                  <>
                    <div key={`lbl-${hour}`} className="schedule-cell time-label" style={{ height: 50, fontSize: 13 }}>{hour}</div>
                    {DAYS.map((_, di) => (
                      <div
                        key={`${hour}-${di}`}
                        className={`schedule-cell${schedule[hour][di] ? ' active' : ''}`}
                        onClick={() => toggleCell(hour, di)}
                        title={`${hour} - ${DAYS[di]}: ${schedule[hour][di] ? 'Permitido' : 'Bloqueado'}`}
                        style={{ height: 50, cursor: 'pointer' }}
                      />
                    ))}
                  </>
                ))}
              </div>

              {/* Botón guardar grande */}
              <button 
                className="btn btn-primary w-full mt-4" 
                style={{ 
                  padding: '16px', 
                  fontSize: 18, 
                  fontWeight: 700,
                  justifyContent: 'center'
                }}
              >
                💾 Guardar Horario
              </button>
            </div>
          </div>

          {/* Panel derecho: presets simples */}
          <div style={{ width: 280 }}>
            <div className="card p-4">
              <strong style={{ fontSize: 16, display: 'block', marginBottom: 16 }}>⚡ Horarios Rápidos</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PRESETS.map(p => (
                  <button 
                    key={p.label} 
                    className="preset-card"
                    style={{ 
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      border: '2px solid var(--border)'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'var(--blue)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <strong style={{ fontSize: 14 }}>{p.label}</strong>
                    <span style={{ fontSize: 12 }}>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
