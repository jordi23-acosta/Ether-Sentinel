import { useState } from 'react';
import { Wand2, X, Plus } from 'lucide-react';
import Topbar from '../components/Topbar';
import { horarioInicial } from '../data/mockData';

const HORAS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
const DIAS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

const presets = [
  { nombre: 'Estándar de Oficina', desc: 'Lun-Vie, 08:00 - 18:00' },
  { nombre: 'Seguridad Nocturna', desc: '22:00 - 06:00, Bloqueo Total' },
  { nombre: 'Ventana de Invitados', desc: 'Solo Fines de Semana, 10:00 - 16:00' },
];

export default function Horarios() {
  const [horario, setHorario] = useState(horarioInicial);
  const [inspeccion, setInspeccion] = useState(true);
  const [vpn, setVpn] = useState(false);
  const [excepciones, setExcepciones] = useState(['CEO-Macbook', 'Servidor-Principal']);
  const [nuevaExcepcion, setNuevaExcepcion] = useState('');

  // Alternar celda del horario
  const toggleCelda = (dia, hora) => {
    setHorario(prev => ({
      ...prev,
      [dia]: { ...prev[dia], [hora]: !prev[dia][hora] },
    }));
  };

  const agregarExcepcion = () => {
    if (nuevaExcepcion.trim()) {
      setExcepciones(prev => [...prev, nuevaExcepcion.trim()]);
      setNuevaExcepcion('');
    }
  };

  return (
    <div>
      <Topbar placeholder="Buscar registros de red..." />
      <div style={{ padding: '28px' }}>
        {/* Encabezado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              Gestión de Políticas
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Horario de Acceso</h1>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '480px' }}>
              Defina ventanas de tiempo precisas para la disponibilidad de la red. Resalte franjas específicas para habilitar el enrutamiento activo.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              padding: '12px 20px', border: '1px solid #e2e8f0', borderRadius: '8px',
              background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
            }}>
              Aplicar a todos los dispositivos
            </button>
            <button style={{
              padding: '12px 20px', background: '#2563eb', color: 'white', border: 'none',
              borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
            }}>
              Guardar Horario
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Grilla de horario */}
          <div style={{ flex: 1 }}>
            <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {/* Leyenda */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <div style={{ width: '16px', height: '16px', background: '#2563eb', borderRadius: '3px' }} />
                    Acceso Activo
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <div style={{ width: '16px', height: '16px', background: '#e2e8f0', borderRadius: '3px' }} />
                    Restringido
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {['Semanal', 'Mensual'].map(v => (
                    <button key={v} style={{
                      padding: '6px 14px', borderRadius: '6px', border: '1px solid #e2e8f0',
                      background: v === 'Semanal' ? '#2563eb' : 'white',
                      color: v === 'Semanal' ? 'white' : '#475569',
                      cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                    }}>{v}</button>
                  ))}
                </div>
              </div>

              {/* Tabla de horario */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '4px' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '70px' }} />
                      {DIAS.map(dia => (
                        <th key={dia} style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textAlign: 'center', padding: '4px' }}>{dia}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HORAS.map(hora => (
                      <tr key={hora}>
                        <td style={{ fontSize: '12px', color: '#94a3b8', paddingRight: '8px', whiteSpace: 'nowrap' }}>{hora}</td>
                        {DIAS.map(dia => (
                          <td key={dia} style={{ padding: '2px' }}>
                            <button
                              onClick={() => toggleCelda(dia, hora)}
                              style={{
                                width: '100%', height: '36px', borderRadius: '6px', border: 'none',
                                background: horario[dia][hora] ? '#2563eb' : '#e8edf5',
                                cursor: 'pointer', transition: 'background 0.15s',
                              }}
                              title={`${dia} ${hora}: ${horario[dia][hora] ? 'Activo' : 'Restringido'}`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Panel lateral */}
          <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Presets */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', fontWeight: 600, fontSize: '14px' }}>
                <Wand2 size={16} color="#2563eb" /> Ajustes de Horario
              </div>
              {presets.map((p) => (
                <div key={p.nombre} style={{
                  padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px',
                  marginBottom: '8px', cursor: 'pointer',
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{p.nombre}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>{p.desc}</div>
                </div>
              ))}
            </div>

            {/* Protocolo de restricción */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '14px' }}>Protocolo de Restricción</div>
              {[
                { label: 'Inspección Profunda', desc: 'Habilitar para períodos activos', val: inspeccion, set: setInspeccion },
                { label: 'VPN Obligatoria', desc: 'Restricción fuera de horas pico', val: vpn, set: setVpn },
              ].map(({ label, desc, val, set }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{label}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{desc}</div>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={val} onChange={() => set(!val)} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}

              {/* Excepciones */}
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Lista de Excepciones
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {excepciones.map((exc) => (
                  <span key={exc} style={{
                    background: '#eff6ff', color: '#2563eb', padding: '3px 8px',
                    borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    {exc}
                    <button onClick={() => setExcepciones(prev => prev.filter(e => e !== exc))}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb', padding: 0, lineHeight: 1 }}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input
                    value={nuevaExcepcion}
                    onChange={(e) => setNuevaExcepcion(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && agregarExcepcion()}
                    placeholder="Añadir..."
                    style={{ width: '80px', padding: '3px 6px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
                  />
                  <button onClick={agregarExcepcion} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' }}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card de eficiencia */}
            <div style={{ background: '#f97316', borderRadius: '12px', padding: '20px', color: 'white' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', opacity: 0.8, marginBottom: '8px' }}>
                Optimización en Vivo
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, marginBottom: '6px' }}>14% de Eficiencia</div>
              <div style={{ fontSize: '12px', opacity: 0.85, lineHeight: '1.5' }}>
                El horario propuesto reducirá el consumo inactivo de energía en un 14% en 82 terminales.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
