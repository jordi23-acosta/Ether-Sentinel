import { useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import { Monitor, Search, ShieldCheck, ShieldOff } from 'lucide-react'
import { getDevices, blockDevice, unblockDevice } from '../lib/api'

export default function Dispositivos() {
  const [devices, setDevices] = useState([])
  const [search, setSearch]   = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // Cargar dispositivos al montar
  useEffect(() => {
    loadDevices()
  }, [])

  const loadDevices = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDevices()
      setDevices(data)
    } catch (err) {
      setError(err.message)
      console.error('Error cargando dispositivos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Alterna el estado activo/bloqueado de un dispositivo
  const toggleDevice = async (device) => {
    try {
      if (device.status) {
        await blockDevice(device.ip, `Bloqueado desde panel - ${new Date().toLocaleString()}`)
      } else {
        await unblockDevice(device.ip)
      }
      // Recargar dispositivos
      await loadDevices()
    } catch (err) {
      alert(`Error: ${err.message}`)
    }
  }

  const filtered = devices.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.ip.includes(search) ||
    d.mac.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Topbar searchPlaceholder="Buscar dispositivos..." />
      <div className="page-body">

        {/* Encabezado */}
        <div className="page-header">
          <h1>Mis <span>Dispositivos</span></h1>
          <p style={{ fontSize: 16 }}>Aquí puedes ver todos los dispositivos conectados y bloquear o permitir su acceso a internet.</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="mt-4 mb-4">
          <div className="search-bar" style={{ width: '100%', maxWidth: 500, padding: '12px 16px' }}>
            <Search size={18} color="var(--text-muted)" />
            <input
              placeholder="Buscar por nombre..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: 15 }}
            />
          </div>
        </div>

        {/* Mensajes de estado */}
        {loading && (
          <div className="card p-5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            Cargando dispositivos...
          </div>
        )}

        {error && (
          <div className="card p-5" style={{ background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
            <strong style={{ color: 'var(--red)' }}>Error al conectar con el MikroTik:</strong>
            <p style={{ fontSize: 13, marginTop: 8, color: 'var(--text)' }}>{error}</p>
            <button className="btn btn-primary mt-2" onClick={loadDevices}>
              Reintentar
            </button>
          </div>
        )}

        {/* Tabla de dispositivos */}
        {!loading && !error && (
          <div className="card">
            <div style={{ padding: '20px' }}>
              <div style={{ padding: '20px' }}>
              {filtered.map(device => (
                <div key={device.id} style={{
                  background: 'rgba(30, 41, 59, 0.5)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${device.blocked ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)'}`,
                  borderRadius: 16,
                  padding: 24,
                  marginBottom: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s'
                }}>
                  {/* Izquierda: Icono y nombre */}
                  <div className="flex items-center gap-4">
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      background: device.blocked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                      border: `2px solid ${device.blocked ? 'rgba(239, 68, 68, 0.4)' : 'rgba(34, 197, 94, 0.4)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Monitor size={28} color={device.blocked ? '#FCA5A5' : '#4ADE80'} />
                    </div>
                    <div>
                      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#F1F5F9' }}>
                        {device.name}
                      </div>
                      <div style={{ fontSize: 14, color: '#94A3B8' }}>
                        {device.ip}
                      </div>
                    </div>
                  </div>

                  {/* Derecha: Botón grande */}
                  <button
                    onClick={() => toggleDevice(device)}
                    style={{
                      background: device.blocked ? '#22C55E' : '#EF4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      padding: '16px 32px',
                      fontSize: 18,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      transition: 'all 0.3s',
                      boxShadow: device.blocked 
                        ? '0 4px 16px rgba(34, 197, 94, 0.3)' 
                        : '0 4px 16px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'scale(1.05)'
                      e.currentTarget.style.boxShadow = device.blocked 
                        ? '0 6px 20px rgba(34, 197, 94, 0.5)' 
                        : '0 6px 20px rgba(239, 68, 68, 0.5)'
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.boxShadow = device.blocked 
                        ? '0 4px 16px rgba(34, 197, 94, 0.3)' 
                        : '0 4px 16px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    {device.blocked ? (
                      <>
                        <ShieldCheck size={24} />
                        PERMITIR
                      </>
                    ) : (
                      <>
                        <ShieldOff size={24} />
                        BLOQUEAR
                      </>
                    )}
                  </button>
                </div>
              ))}

              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: '#94A3B8' }}>
                  No se encontraron dispositivos
                </div>
              )}
            </div>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center p-4" style={{ borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: '#94A3B8' }}>
              Mostrando {filtered.length} de {devices.length} dispositivos registrados
            </span>
            <div className="flex gap-2">
              <button className="btn btn-secondary" style={{ fontSize: 12 }}>Anterior</button>
              <button className="btn btn-primary" style={{ fontSize: 12 }}>Siguiente</button>
              </div>
            </div>
          </div>
        )}

        {/* Tarjetas de métricas inferiores */}
        <div className="grid-3 mt-4">
          <div className="stat-card">
            <div className="stat-card-tag">Tiempo Real</div>
            <div className="stat-card-value" style={{ fontSize: 26 }}>852 Mbps</div>
            <div className="stat-card-label">Carga de Red Agregada</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-tag">Salud de Seguridad</div>
            <div className="stat-card-value" style={{ fontSize: 26 }}>99.8%</div>
            <div className="stat-card-label">Puntuación de Integridad de Paquetes</div>
          </div>
          <div className="card-blue p-5">
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', opacity: .8, marginBottom: 8 }}>Guardián</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>3 Sondas</div>
            <div style={{ fontSize: 12, opacity: .8 }}>Escaneos activos en progreso</div>
          </div>
        </div>

      </div>
    </>
  )
}
