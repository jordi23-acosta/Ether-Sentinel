import { useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import { Monitor, ArrowUp, ArrowDown, ShieldOff, RefreshCw, ExternalLink } from 'lucide-react'
import { getNetworkStatus, getNetworkTraffic, getDevices } from '../lib/api'

// Alturas de las barras del gráfico (simuladas)
const chartData = [30, 45, 55, 40, 60, 75, 50, 90, 70, 55, 45, 65]
const chartLabels = ['12:00 AM', '06:00 AM', '12:00 PM', '06:00 PM', 'ACTUAL']

export default function Dashboard() {
  const [networkOn, setNetworkOn] = useState(true)
  const [networkStatus, setNetworkStatus] = useState(null)
  const [traffic, setTraffic] = useState(null)
  const [devices, setDevices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    // Actualizar cada 10 segundos
    const interval = setInterval(loadDashboardData, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const [statusData, trafficData, devicesData] = await Promise.all([
        getNetworkStatus().catch(() => null),
        getNetworkTraffic().catch(() => null),
        getDevices().catch(() => [])
      ])
      setNetworkStatus(statusData)
      setTraffic(trafficData)
      setDevices(devicesData)
      setLoading(false)
    } catch (err) {
      console.error('Error cargando dashboard:', err)
      setLoading(false)
    }
  }

  const activeDevices = devices.filter(d => d.status).length
  const totalDevices = devices.length

  return (
    <>
      <Topbar searchPlaceholder="Buscar dispositivos..." />
      <div className="page-body">

        {/* Encabezado */}
        <div className="page-header">
          <h1>Panel de <span>Control</span></h1>
          <p style={{ fontSize: 16 }}>Aquí puedes ver el estado de tu red y los dispositivos conectados.</p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid-3" style={{ marginBottom: 20 }}>
          {/* Dispositivos */}
          <div className="stat-card">
            <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
              <div style={{ background: '#EFF6FF', borderRadius: 8, padding: 8 }}>
                <Monitor size={18} color="var(--blue)" />
              </div>
            </div>
            <div className="stat-card-tag">Dispositivos Conectados</div>
            <div className="stat-card-value">{loading ? '...' : activeDevices}</div>
            <div className="stat-card-label">de {totalDevices} registrados</div>
          </div>

          {/* Ancho de banda */}
          <div className="stat-card">
            <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
              <div style={{ background: '#FFF7ED', borderRadius: 8, padding: 8 }}>
                <ArrowDown size={18} color="var(--orange)" />
              </div>
            </div>
            <div className="stat-card-tag">Datos Descargados</div>
            <div className="stat-card-value" style={{ fontSize: 26 }}>
              {loading || !traffic ? '...' : (traffic.totals.rxBytes / 1024 / 1024).toFixed(1)} 
              <span style={{ fontSize: 16, fontWeight: 500 }}> MB</span>
            </div>
          </div>

          {/* Estado */}
          <div className="stat-card">
            <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
              <div style={{ background: '#F0FDF4', borderRadius: 8, padding: 8 }}>
                <ShieldOff size={18} color="var(--green)" />
              </div>
            </div>
            <div className="stat-card-tag">Estado de la Red</div>
            <div className="stat-card-value" style={{ fontSize: 26, color: 'var(--green)' }}>Activa</div>
            <div className="stat-card-label">Todo funcionando bien</div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div>
          <strong style={{ fontSize: 18, marginBottom: 16, display: 'block' }}>Últimos Dispositivos Conectados</strong>
          <div className="grid-3">
            {devices.slice(0, 3).map(d => (
              <div key={d.id} className="recent-device-card">
                <div className="device-icon" style={{ background: d.status ? '#EFF6FF' : '#FEF2F2' }}>
                  <Monitor size={18} color={d.status ? 'var(--blue)' : 'var(--red)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 13 }}>{d.name}</strong>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.lastSeen}</div>
                </div>
                <span className={`badge ${d.status ? 'badge-green' : 'badge-red'}`} style={{ fontSize: 10 }}>
                  {d.status ? 'ACTIVO' : 'BLOQUEADO'}
                </span>
              </div>
            ))}
            {devices.length === 0 && !loading && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
                No hay dispositivos conectados
              </p>
            )}
          </div>
        </div>

      </div>
    </>
  )
}
