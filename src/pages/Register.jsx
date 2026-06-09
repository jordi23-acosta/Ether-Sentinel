import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Mail, Eye, EyeOff, ShieldCheck, UserPlus, ArrowLeft } from 'lucide-react'
import { register } from '../lib/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    username: '', 
    password: '', 
    confirmPassword: '',
    email: '' 
  })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validaciones
    if (!form.username || !form.password || !form.confirmPassword) {
      setError('Por favor completa todos los campos obligatorios.')
      return
    }
    
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    
    setLoading(true)
    
    try {
      const response = await register(form.username, form.password, form.email || null)
      
      if (response.success) {
        alert('✅ Usuario creado correctamente. Ahora puedes iniciar sesión.')
        navigate('/login')
      } else {
        setError('Error al crear el usuario.')
      }
    } catch (err) {
      setError(err.message || 'Error al registrar usuario.')
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
      <h1 className="login-title">Crear Cuenta</h1>
      <p className="login-subtitle">Regístrate en Ether Sentinel</p>

      {/* Tarjeta de registro */}
      <form className="login-card" onSubmit={handleSubmit}>
        {/* Campo usuario */}
        <div style={{ marginBottom: 18 }}>
          <label className="login-label">Usuario *</label>
          <div className="input-icon-wrap">
            <User size={15} className="input-icon" />
            <input
              className="input"
              placeholder="Elige un nombre de usuario"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              autoComplete="username"
            />
          </div>
        </div>

        {/* Campo email (opcional) */}
        <div style={{ marginBottom: 18 }}>
          <label className="login-label">Email (opcional)</label>
          <div className="input-icon-wrap">
            <Mail size={15} className="input-icon" />
            <input
              className="input"
              type="email"
              placeholder="tu@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              autoComplete="email"
            />
          </div>
        </div>

        {/* Campo contraseña */}
        <div style={{ marginBottom: 18 }}>
          <label className="login-label">Contraseña *</label>
          <div className="input-icon-wrap">
            <Lock size={15} className="input-icon" />
            <input
              className="input"
              type={showPass ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              autoComplete="new-password"
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

        {/* Confirmar contraseña */}
        <div style={{ marginBottom: 18 }}>
          <label className="login-label">Confirmar Contraseña *</label>
          <div className="input-icon-wrap">
            <Lock size={15} className="input-icon" />
            <input
              className="input"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              autoComplete="new-password"
              style={{ paddingRight: 38 }}
            />
            <button
              type="button"
              className="input-icon-right"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

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
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'} <UserPlus size={16} />
        </button>

        {/* Link a login */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
          ¿Ya tienes cuenta? <a href="/login" style={{ color: 'var(--blue)', textDecoration: 'none' }}>Inicia sesión aquí</a>
        </p>
        
        {/* Botón volver */}
        <button 
          type="button"
          onClick={() => navigate('/login')}
          className="btn"
          style={{ 
            justifyContent: 'center', 
            padding: '10px', 
            fontSize: 13, 
            marginTop: 8,
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)'
          }}
        >
          <ArrowLeft size={16} /> Volver al Login
        </button>
      </form>

      {/* Footer */}
      <div className="login-footer">
        <div className="login-links">
          <a href="#">Política de Privacidad</a>
          <a href="#">Términos de Servicio</a>
        </div>
        <div className="security-badge">
          <ShieldCheck size={13} />
          Contraseñas encriptadas con SHA-256
        </div>
      </div>
    </div>
  )
}
