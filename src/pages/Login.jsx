import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

// Pantalla de login con validación básica
export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPass, setMostrarPass] = useState(false);
  const [recordar, setRecordar] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Validación básica
    if (!usuario.trim() || !password.trim()) {
      setError('Por favor completa todos los campos.');
      return;
    }
    // Credenciales simuladas (usuario: admin / contraseña: admin123)
    if (usuario.trim() === 'admin' && password.trim() === 'admin123') {
      setError('');
      navigate('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos. Verifica tus credenciales.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #e8edf5 0%, #dde4f0 50%, #e2e8f5 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo y título */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '64px', height: '64px', background: '#2563eb', borderRadius: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
        }}>
          <Shield size={32} color="white" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Ether Sentinel</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Control de Acceso a la Red y Orquestación</p>
      </div>

      {/* Tarjeta de login */}
      <div style={{
        background: 'white', borderRadius: '16px', padding: '36px',
        width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderTop: '4px solid #2563eb',
      }}>
        <form onSubmit={handleLogin}>
          {/* Campo usuario */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Usuario
            </label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => { setUsuario(e.target.value); setError(''); }}
                style={{
                  width: '100%', padding: '11px 12px 11px 38px', border: '1px solid #e2e8f0',
                  borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Campo contraseña */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Contraseña
              </label>
              <a href="#" style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none' }}>¿Olvidaste tu contraseña?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={mostrarPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                style={{
                  width: '100%', padding: '11px 40px 11px 38px', border: '1px solid #e2e8f0',
                  borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border 0.2s',
                }}
                onFocus={(e) => e.target.style.borderColor = '#2563eb'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setMostrarPass(!mostrarPass)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                {mostrarPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Recordar dispositivo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <input
              type="checkbox"
              id="recordar"
              checked={recordar}
              onChange={(e) => setRecordar(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2563eb', cursor: 'pointer' }}
            />
            <label htmlFor="recordar" style={{ fontSize: '14px', color: '#475569', cursor: 'pointer' }}>
              Recordar este dispositivo
            </label>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
              padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px',
            }}>
              {error}
            </div>
          )}

          {/* Botón submit */}
          <button
            type="submit"
            style={{
              width: '100%', padding: '12px', background: '#2563eb', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.background = '#1d4ed8'}
            onMouseLeave={(e) => e.target.style.background = '#2563eb'}
          >
            <LogIn size={18} /> Iniciar Sesión
          </button>

          {/* Hint de demo */}
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '14px' }}>
            Demo: <span style={{ fontFamily: 'monospace', color: '#64748b' }}>admin</span> / <span style={{ fontFamily: 'monospace', color: '#64748b' }}>admin123</span>
          </p>
        </form>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '24px', display: 'flex', gap: '32px' }}>
        {['Política de Privacidad', 'Términos de Servicio', 'Auditoría de Seguridad'].map((item) => (
          <a key={item} href="#" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none', textAlign: 'center' }}>{item}</a>
        ))}
      </div>
      <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Shield size={14} color="#dc2626" />
        <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Estándar de Encriptación AES-256 Activado
        </span>
      </div>
    </div>
  );
}
