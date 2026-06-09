import { Bell, ShieldCheck, Search } from 'lucide-react'

/**
 * Barra superior con estado de red, buscador e iconos de acción.
 * @param {string} searchPlaceholder - Texto del placeholder del buscador
 */
export default function Topbar({ searchPlaceholder = 'Buscar...' }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Indicador de estado de red */}
        <div className="status-badge">
          <span className="status-dot" />
          Estado de la Red: Operativo
        </div>
      </div>

      <div className="topbar-right">
        {/* Buscador */}
        <div className="search-bar">
          <Search size={14} color="var(--text-muted)" />
          <input placeholder={searchPlaceholder} />
        </div>

        {/* Notificaciones */}
        <button className="icon-btn" title="Notificaciones">
          <Bell size={15} />
        </button>

        {/* Escudo de seguridad */}
        <button className="icon-btn" title="Seguridad">
          <ShieldCheck size={15} />
        </button>

        {/* Avatar de usuario */}
        <div className="avatar" style={{ cursor: 'pointer' }}>A</div>
      </div>
    </header>
  )
}
