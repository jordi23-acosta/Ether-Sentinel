import { useState } from 'react'
import Topbar from '../components/Topbar'

export default function Configuracion() {
  // Credenciales
  const [creds, setCreds] = useState({ pass: '', confirm: '' })
  const [credMsg, setCredMsg] = useState('')

  const handleSave = () => {
    if (creds.pass && creds.pass !== creds.confirm) {
      setCredMsg('Las contraseñas no coinciden.')
      return
    }
    setCredMsg('Configuración guardada correctamente.')
    setTimeout(() => setCredMsg(''), 3000)
  }

  return (
    <>
      <Topbar searchPlaceholder="Buscar..." />
      <div className="page-body">

        {/* Encabezado */}
        <div className="page-header">
          <h1>Configuración</h1>
          <p style={{ fontSize: 16 }}>Aquí puedes ver la información del sistema y cambiar la contraseña.</p>
        </div>

        {/* Info del sistema - más simple */}
        <div className="card p-5" style={{ marginBottom: 20 }}>
          <div className="flex justify-between items-center mb-4">
            <strong style={{ fontSize: 18, color: '#F1F5F9' }}>📊 Información del Sistema</strong>
            <span style={{ 
              background: 'rgba(34, 197, 94, 0.2)', 
              color: '#4ADE80', 
              padding: '6px 16px', 
              borderRadius: 20, 
              fontSize: 13, 
              fontWeight: 700,
              border: '1px solid rgba(34, 197, 94, 0.4)'
            }}>
              ✅ FUNCIONANDO
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { label: '🖥️ Versión del Sistema', value: 'v4.2.0' },
              { label: '⏱️ Tiempo Activo', value: '14 días 6 horas' },
              { label: '💾 Memoria Usada', value: '45%' },
              { label: '⚡ CPU', value: '12%' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: 12,
                padding: 20,
                border: '2px solid rgba(59, 130, 246, 0.3)'
              }}>
                <div style={{ fontSize: 14, color: '#94A3B8', marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#F1F5F9' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cambiar contraseña - más simple */}
        <div className="card p-5">
          <strong style={{ fontSize: 18, display: 'block', marginBottom: 4, color: '#F1F5F9' }}>🔐 Cambiar Contraseña</strong>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
            Cambia la contraseña para entrar al sistema.
          </p>

          <div style={{ maxWidth: 500 }}>
            <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8, color: '#94A3B8' }}>
              Nueva Contraseña
            </label>
            <input
              className="input"
              type="password"
              placeholder="Escribe tu nueva contraseña"
              value={creds.pass}
              onChange={e => setCreds(prev => ({ ...prev, pass: e.target.value }))}
              style={{ marginBottom: 16, fontSize: 15, padding: '14px 16px' }}
            />

            <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8, color: '#94A3B8' }}>
              Confirmar Contraseña
            </label>
            <input
              className="input"
              type="password"
              placeholder="Escribe de nuevo tu contraseña"
              value={creds.confirm}
              onChange={e => setCreds(prev => ({ ...prev, confirm: e.target.value }))}
              style={{ marginBottom: 16, fontSize: 15, padding: '14px 16px' }}
            />

            {credMsg && (
              <p style={{
                marginBottom: 16, 
                fontSize: 14, 
                padding: '12px 16px', 
                borderRadius: 8,
                background: credMsg.includes('correctamente') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: credMsg.includes('correctamente') ? '#4ADE80' : '#FCA5A5',
                fontWeight: 600,
                border: credMsg.includes('correctamente') ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)'
              }}>
                {credMsg}
              </p>
            )}

            <button
              className="btn btn-primary"
              onClick={handleSave}
              style={{ 
                padding: '14px 28px', 
                fontSize: 16, 
                fontWeight: 700,
                width: '100%',
                justifyContent: 'center'
              }}
            >
              💾 Guardar Contraseña
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
