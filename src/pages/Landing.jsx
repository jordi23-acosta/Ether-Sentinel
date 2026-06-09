import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  ShieldCheck, 
  Monitor, 
  Clock, 
  Shield, 
  Zap, 
  Lock,
  ArrowRight,
  CheckCircle,
  Users,
  Globe,
  Activity
} from 'lucide-react'

// Componente de efecto typewriter
function Typewriter({ texts, speed = 100, deleteSpeed = 50, pauseTime = 2000 }) {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentText = texts[currentIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Escribiendo
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          // Terminó de escribir, esperar antes de borrar
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        // Borrando
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          // Terminó de borrar, pasar al siguiente texto
          setIsDeleting(false)
          setCurrentIndex((currentIndex + 1) % texts.length)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex, texts, speed, deleteSpeed, pauseTime])

  return (
    <span>
      {displayText}
      <span className="typewriter-cursor">|</span>
    </span>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('inicio')
  
  const typewriterTexts = [
    'Control de Acceso a la Red y Orquestación',
    'Gestión Inteligente de Dispositivos',
    'Protección y Monitoreo en Tiempo Real',
    'Control Parental Avanzado'
  ]

  // Detectar la sección visible al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['inicio', 'caracteristicas', 'requisitos', 'sobre']
      const scrollPosition = window.scrollY + 100 // Offset para activar antes

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId)
        if (section) {
          const { offsetTop, offsetHeight } = section
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Ejecutar al montar

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: Monitor,
      title: 'Control de Dispositivos',
      description: 'Gestiona todos los dispositivos conectados a tu red en tiempo real',
      image: '/images/features/control-dispositivos.png',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    {
      icon: Clock,
      title: 'Horarios Personalizados',
      description: 'Define cuándo y cómo se puede acceder a internet',
      image: '/images/features/horarios.png',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    },
    {
      icon: Shield,
      title: 'Filtrado de Contenido',
      description: 'Bloquea sitios web y contenido inapropiado fácilmente',
      image: '/images/features/filtrado.png',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    },
    {
      icon: Zap,
      title: 'Acción Inmediata',
      description: 'Bloquea o desbloquea dispositivos con un solo clic',
      image: '/images/features/accion-inmediata.png',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      color: '#43e97b'
    },
    {
      icon: Lock,
      title: 'Seguridad Avanzada',
      description: 'Protección robusta con autenticación y encriptación',
      image: '/images/features/seguridad.png',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: '#fa709a'
    },
    {
      icon: Activity,
      title: 'Monitoreo en Vivo',
      description: 'Visualiza el estado de tu red en tiempo real',
      image: '/images/features/monitoreo.png',
      gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      color: '#30cfd0'
    }
  ]

  const requirements = [
    {
      name: 'VirtualBox',
      description: 'Máquina virtual para ejecutar MikroTik CHR (opcional si tienes router físico)',
      version: '7.0 o superior',
      link: 'https://www.virtualbox.org/wiki/Downloads',
      image: '/images/tools/VirtualBox.png',
      required: false
    },
    {
      name: 'MikroTik Router',
      description: 'Router MikroTik físico o MikroTik CHR (Cloud Hosted Router) en tu red',
      version: 'RouterOS 6.x o superior',
      link: 'https://mikrotik.com/download',
      image: '/images/tools/mikrotik.png',
      required: true
    }
  ]

  const stats = [
    { icon: Users, value: 'Ilimitados', label: 'Dispositivos' },
    { icon: Globe, value: '24/7', label: 'Monitoreo' },
    { icon: ShieldCheck, value: '100%', label: 'Seguro' }
  ]

  return (
    <div className="landing-page">
      {/* Header/Navbar */}
      <nav className="landing-nav">
        <div className="landing-nav-content">
          <div className="landing-brand">
            <ShieldCheck size={24} />
            <span>Ether Sentinel</span>
          </div>
          <div className="landing-nav-links">
            <a 
              href="#inicio" 
              className={activeSection === 'inicio' ? 'active' : ''}
            >
              Inicio
            </a>
            <a 
              href="#caracteristicas"
              className={activeSection === 'caracteristicas' ? 'active' : ''}
            >
              Características
            </a>
            <a 
              href="#requisitos"
              className={activeSection === 'requisitos' ? 'active' : ''}
            >
              Requisitos
            </a>
            <a 
              href="#sobre"
              className={activeSection === 'sobre' ? 'active' : ''}
            >
              Sobre el Proyecto
            </a>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero" id="inicio">
        <div className="landing-hero-content">
          <div className="landing-hero-text">
            <h1 className="landing-hero-title">
              Bienvenido a <span className="gradient-text">Ether Sentinel</span>
            </h1>
            <p className="landing-hero-subtitle">
              <Typewriter 
                texts={typewriterTexts}
                speed={80}
                deleteSpeed={40}
                pauseTime={2500}
              />
            </p>
            <p className="landing-hero-description">
              Sistema de gestión y control de redes para administradores que necesitan supervisar y optimizar el acceso a internet de forma simple.
            </p>
            
            <div className="landing-hero-tags">
              <span className="tag">🔒 Seguro</span>
              <span className="tag">⚡ Rápido</span>
              <span className="tag">🎯 Fácil de usar</span>
              <span className="tag">🌐 Control total</span>
            </div>

            <div className="landing-hero-buttons">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/login')}
              >
                Comenzar Ahora <ArrowRight size={20} />
              </button>
            </div>
          </div>

          <div className="landing-hero-image">
            <div className="marvel-device macbook">
              <div className="top-bar"></div>
              <div className="camera"></div>
              <div className="screen">
                {/* Aquí va tu captura o placeholder */}
                <img 
                  src="/images/dashboard-preview.png" 
                  alt="Ether Sentinel Dashboard"
                  className="dashboard-preview"
                  onError={(e) => {
                    // Si no existe la imagen, mostrar placeholder
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="preview-placeholder" style={{ display: 'none' }}>
                  <div className="placeholder-icon">
                    <ShieldCheck size={64} />
                  </div>
                  <h3>Dashboard de Ether Sentinel</h3>
                  <p>Control total de tu red en tiempo real</p>
                  <div className="placeholder-stats">
                    {stats.map((stat, idx) => (
                      <div key={idx} className="placeholder-stat">
                        <stat.icon size={20} />
                        <div>
                          <div className="stat-value">{stat.value}</div>
                          <div className="stat-label">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="bottom-bar"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features" id="caracteristicas">
        <div className="landing-section-header">
          <h2>Características Principales</h2>
          <p>Todo lo que necesitas para controlar tu red en un solo lugar</p>
        </div>
        
        <div className="carousel-infinite">
          <div className="carousel-track-infinite">
            {/* Duplicamos las features para el efecto infinito */}
            {[...features, ...features].map((feature, idx) => (
              <div key={idx} className="feature-card-carousel">
                <div 
                  className="feature-card-header" 
                  style={{ 
                    background: feature.gradient,
                    backgroundImage: `url(${feature.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="feature-card-overlay"></div>
                </div>
                <div className="feature-card-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="landing-requirements" id="requisitos">
        <div className="landing-section-header">
          <h2>Requisitos del Sistema</h2>
          <p>Lo único que necesitas para usar Ether Sentinel</p>
        </div>
        
        <div className="requirements-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: '1000px', margin: '0 auto', gap: '24px' }}>
          {requirements.map((req, idx) => (
            <div key={idx} className="requirement-card">
              <div className="requirement-header">
                <div className="requirement-image-container">
                  <img 
                    src={req.image} 
                    alt={req.name}
                    className="requirement-image"
                  />
                </div>
                <div className="requirement-header-text">
                  <h3>{req.name}</h3>
                  {req.required ? (
                    <span className="badge-required">Requerido</span>
                  ) : (
                    <span className="badge-optional">Opcional</span>
                  )}
                </div>
              </div>
              <p className="requirement-description">{req.description}</p>
              <p className="requirement-version">{req.version}</p>
              <a 
                href={req.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline btn-small"
              >
                Más información <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>

        <div className="installation-note">
          <div className="note-icon">💡</div>
          <div>
            <h4>¿Cómo funciona?</h4>
            <p>
              Ether Sentinel se conecta a tu router MikroTik existente para gestionar tu red. 
              Puedes usar un router MikroTik físico o instalar MikroTik CHR en una máquina virtual. 
              La aplicación web funciona desde cualquier navegador moderno, sin necesidad de instalar software adicional.
            </p>
          </div>
        </div>
      </section>

      {/* Tutorial Section */}
      <section className="landing-tutorial" id="tutorial">
        <div className="landing-section-header">
          <h2>Guía de Instalación</h2>
          <p>Aprende a configurar MikroTik CHR en VirtualBox paso a paso</p>
        </div>

        <div className="tutorial-content">
          <div className="tutorial-video">
            <div className="video-mockup">
              <div className="video-player">
                <div className="video-placeholder">
                  <div className="play-button">
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                      <circle cx="40" cy="40" r="40" fill="rgba(59, 130, 246, 0.9)"/>
                      <path d="M32 25L55 40L32 55V25Z" fill="white"/>
                    </svg>
                  </div>
                  <div className="video-info">
                    <h3>Tutorial Completo de Instalación</h3>
                    <p>15:30 minutos</p>
                  </div>
                </div>
              </div>
              <div className="video-controls">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '35%' }}></div>
                </div>
                <div className="controls-row">
                  <div className="controls-left">
                    <button className="control-btn">▶</button>
                    <button className="control-btn">🔊</button>
                    <span className="time-display">5:25 / 15:30</span>
                  </div>
                  <div className="controls-right">
                    <button className="control-btn">⚙️</button>
                    <button className="control-btn">⛶</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tutorial-steps">
            <h3>Pasos de Instalación</h3>
            <div className="steps-list">
              <div className="step-item">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Descargar VirtualBox</h4>
                  <p>Instala VirtualBox en tu computadora desde el sitio oficial</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Descargar MikroTik CHR</h4>
                  <p>Obtén la imagen ISO de MikroTik CHR desde mikrotik.com</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Crear Máquina Virtual</h4>
                  <p>Configura una nueva VM en VirtualBox con la imagen de MikroTik</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Configurar Red</h4>
                  <p>Establece la configuración de red en modo Bridge o NAT</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-number">5</div>
                <div className="step-content">
                  <h4>Conectar Ether Sentinel</h4>
                  <p>Ingresa las credenciales de tu MikroTik en la aplicación</p>
                </div>
              </div>
            </div>

            <div className="tutorial-cta">
              <a href="#documentacion" className="btn btn-primary btn-large">
                📚 Ver Documentación Completa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="landing-about" id="sobre">
        <div className="about-content">
          <div className="about-text">
            <h2>¿Por qué Ether Sentinel?</h2>
            <p className="about-intro">
              Ether Sentinel nace de la necesidad de tener un control simple 
              pero poderoso sobre las redes domésticas y empresariales.
            </p>
            
            <div className="about-points">
              <div className="about-point">
                <CheckCircle size={20} />
                <div>
                  <strong>Interfaz Intuitiva</strong>
                  <p>Diseñada para ser tan simple que hasta un niño puede usarla</p>
                </div>
              </div>
              
              <div className="about-point">
                <CheckCircle size={20} />
                <div>
                  <strong>Integración con MikroTik</strong>
                  <p>Conexión directa con routers MikroTik CHR para control real</p>
                </div>
              </div>
              
              <div className="about-point">
                <CheckCircle size={20} />
                <div>
                  <strong>Base de Datos Local</strong>
                  <p>Cada instalación es independiente, sin servicios externos</p>
                </div>
              </div>
              
              <div className="about-point">
                <CheckCircle size={20} />
                <div>
                  <strong>Open Source</strong>
                  <p>Código abierto y listo para distribuir</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-image">
            <div className="about-card">
              <div className="about-card-header">
                <h3>🎯 Objetivo del Proyecto</h3>
              </div>
              <div className="about-card-content">
                <p>
                  Proporcionar una herramienta profesional de gestión de redes 
                  que sea accesible para todos, desde padres que quieren 
                  controlar el acceso a internet de sus hijos, hasta 
                  administradores de red que necesitan supervisar múltiples 
                  dispositivos.
                </p>
                <div className="tech-stack">
                  <span className="tech-badge">React</span>
                  <span className="tech-badge">Python</span>
                  <span className="tech-badge">Flask</span>
                  <span className="tech-badge">MikroTik API</span>
                  <span className="tech-badge">SQLite</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="cta-content">
          <h2>¿Listo para tomar el control de tu red?</h2>
          <p>Comienza a usar Ether Sentinel hoy mismo</p>
          <div className="cta-buttons">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/login')}
            >
              Iniciar Sesión <ArrowRight size={20} />
            </button>
            <button 
              className="btn btn-outline btn-large"
              onClick={() => navigate('/register')}
            >
              Crear Cuenta Gratis
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <ShieldCheck size={24} />
            <span>Ether Sentinel</span>
          </div>
          <div className="footer-text">
            <p>Sistema de Control de Acceso a la Red y Orquestación</p>
            <p className="footer-copyright">
              © 2026 Ether Sentinel. Desarrollado con ❤️ para la comunidad.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
