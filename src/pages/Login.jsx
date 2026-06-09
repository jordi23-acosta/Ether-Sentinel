import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, ShieldCheck, LogIn } from 'lucide-react'
import { login } from '../lib/api'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm]         = useState({ user: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validación básica
    if (!form.user || !form.password) {
      setError('Por favor completa todos los campos.')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await login(form.user, form.password)
      
      if (response.success) {
        // Guardar usuario en localStorage si "recordar" está activado
        if (remember) {
          localStorage.setItem('ether_sentinel_user', JSON.stringify(response.user))
        }
        navigate('/dashboard')
      } else {
        setError('Usuario o contraseña incorrectos.')
      }
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Logo y título */}
      <div className="login-logo">
        <ShieldCheck size={30} color="white" />
      </div>
      <h1 className="login-title">Ether Sentinel</h1>
      <p className="login-subtitle">Control de Acceso a la Red y Orquestación</p>

      {/* Tarjeta de login */}
      <form className="login-card" onSubmit={handleSubmit}>
        {/* Campo usuario */}
        <div style={{ marginBottom: 18 }}>
          <label className="login-label">Usuario</label>
          <div className="input-icon-wrap">
            <User size={15} className="input-icon" />
            <input
              className="input"
              placeholder="Ingresa tu usuario"
              value={form.user}
              onChange={e => setForm({ ...form, user: e.target.value })}
              autoComplete="username"
            />
          </div>
        </div>

        {/* Campo contraseña */}
        <div style={{ marginBottom: 18 }}>
          <div className="flex justify-between items-center mb-1" style={{ marginBottom: 6 }}>
            <label className="login-label" style={{ margin: 0 }}>Contraseña</label>
            <a href="#" style={{ fontSize: 12, color: 'var(--blue)', textDecoration: 'none' }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="input-icon-wrap">
            <Lock size={15} className="input-icon" />
            <input
              className="input"
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="current-password"
              style={{ paddingRight: 38 }}
            />
            <button
              type="button"
              className="input-icon-right"
              onClick={() => setShowPass(!showPass)}
              aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Recordar dispositivo */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 20 }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            style={{ accentColor: 'var(--blue)', width: 15, height: 15 }}
          />
          Recordar este dispositivo
        </label>

        {/* Error */}
        {error && (
          <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12, background: '#FEF2F2', padding: '8px 12px', borderRadius: 6 }}>
            {error}
          </p>
        )}

        {/* Botón submit */}
        <button 
          type="submit" 
          className="btn btn-primary w-full" 
          style={{ justifyContent: 'center', padding: '12px', fontSize: 14 }}
          disabled={loading}
        >
          {loading ? 'Iniciando...' : 'Iniciar Sesión'} <LogIn size={16} />
        </button>

        {/* Hint de credenciales demo */}
        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 12 }}>
          Usuario por defecto: <strong>admin</strong> / contraseña <strong>admin123</strong>
        </p>
        
        {/* Link a registro */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          ¿No tienes cuenta? <a href="/register" style={{ color: 'var(--blue)', textDecoration: 'none' }}>Regístrate aquí</a>
        </p>
      </form>

      {/* Footer */}
      <div className="login-footer">
        <div className="login-links">
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos de Servicio</a>
          <a href="#">Auditoría de Seguridad</a>
        </div>
        <div className="security-badge">
          <ShieldCheck size={13} />
          Estándar de Encriptación AES-256 Activado
        </div>
      </div>
    </div>
  )
}
