// Datos simulados — reemplaza con llamadas a API cuando tengas backend

export const devices = [
  { id: 1, name: 'MacBook Pro 16"', ip: '192.168.1.104', mac: '00:1A:2B:3C:4D:5E', type: 'Wi-Fi 6', status: true,  lastSeen: 'Visto hace 2m' },
  { id: 2, name: 'iPhone 15 Pro',   ip: '192.168.1.112', mac: '44:D8:32:01:FF:8B', type: 'Wi-Fi 6', status: true,  lastSeen: 'Visto hace 15m' },
  { id: 3, name: 'Estación de Trabajo', ip: '192.168.1.50', mac: '8C:04:11:A9:33:B4', type: 'Ethernet', status: false, lastSeen: 'BLOQUEADO POR POLÍTICA' },
  { id: 4, name: 'HP LaserJet Oficina', ip: '192.168.1.201', mac: 'F0:45:92:E3:A1:08', type: 'Ethernet', status: true,  lastSeen: 'Conectado vía LAN' },
];

export const blockedDomains = ['facebook.com', 'instagram.com', 'tiktok.com'];
export const allowedDomains = ['google.com', 'aws.amazon.com', 'github.com'];

// Horario: matriz [hora][dia] — true = acceso activo
// horas: 08:00 a 18:00, días: Lun-Dom
export const defaultSchedule = {
  '08:00': [false, false, false, false, false, false, false],
  '09:00': [true,  true,  true,  true,  true,  false, false],
  '10:00': [true,  true,  true,  true,  true,  true,  true ],
  '11:00': [true,  true,  true,  true,  true,  true,  true ],
  '12:00': [false, false, false, false, false, false, false],
  '13:00': [true,  true,  true,  true,  true,  false, false],
  '14:00': [true,  true,  true,  true,  true,  false, false],
  '15:00': [true,  true,  true,  true,  true,  false, false],
  '16:00': [true,  true,  true,  true,  true,  false, false],
  '17:00': [false, false, false, false, false, false, false],
};

export const recentActivity = [
  { id: 1, name: 'iPhone 15 Pro',    conn: 'Conectado hace 2 min',  tag: 'WPA3', color: '#3B82F6' },
  { id: 2, name: 'MacBook Pro M3',   conn: 'Conectado hace 14 min', tag: 'ETH',  color: '#6366F1' },
  { id: 3, name: 'Televisor Salón',  conn: 'Conectado hace 1h',     tag: 'WiFi', color: '#F97316' },
];
