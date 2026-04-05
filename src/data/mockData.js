// Datos simulados para toda la aplicación (sin backend)

export const dispositivosMock = [
  { id: 1, nombre: 'MacBook Pro 16"', ip: '192.168.1.104', mac: '00:1A:2B:3C:4D:5E', tipo: 'Wi-Fi 6', estado: true, visto: 'Visto hace 2m' },
  { id: 2, nombre: 'iPhone 15 Pro', ip: '192.168.1.112', mac: '44:D8:32:01:FF:8B', tipo: 'Wi-Fi 6', estado: true, visto: 'Visto hace 15m' },
  { id: 3, nombre: 'Estación de Trabajo', ip: '192.168.1.50', mac: '8C:04:11:A9:33:B4', tipo: 'Ethernet', estado: false, visto: 'BLOQUEADO POR POLÍTICA' },
  { id: 4, nombre: 'HP LaserJet Oficina', ip: '192.168.1.201', mac: 'F0:45:92:E3:A1:B8', tipo: 'Ethernet', estado: true, visto: 'Conectado vía LAN' },
  { id: 5, nombre: 'Televisor Salón', ip: '192.168.1.88', mac: 'A1:B2:C3:D4:E5:F6', tipo: 'Wi-Fi 5', estado: true, visto: 'Conectado hace 1h' },
  { id: 6, nombre: 'Tablet Samsung', ip: '192.168.1.95', mac: 'B2:C3:D4:E5:F6:A1', tipo: 'Wi-Fi 6', estado: false, visto: 'Visto hace 3h' },
];

export const actividadReciente = [
  { id: 1, nombre: 'iPhone 15 Pro', tipo: 'WPA3', tiempo: 'Conectado hace 2 min', icono: '📱' },
  { id: 2, nombre: 'MacBook Pro M3', tipo: 'ETH', tiempo: 'Conectado hace 14 min', icono: '💻' },
  { id: 3, nombre: 'Televisor Salón', tipo: 'WIFI', tiempo: 'Conectado hace 1h', icono: '📺' },
];

export const sitiosBloqueados = ['facebook.com', 'instagram.com', 'tiktok.com'];
export const sitiosPermitidos = ['google.com', 'aws.amazon.com', 'github.com'];

// Horario: días x horas (true = acceso activo)
export const horarioInicial = {
  LUN: { '08:00': false, '09:00': true, '10:00': true, '11:00': true, '12:00': false, '13:00': false, '14:00': true, '15:00': true, '16:00': true, '17:00': true, '18:00': false },
  MAR: { '08:00': false, '09:00': true, '10:00': true, '11:00': true, '12:00': false, '13:00': false, '14:00': true, '15:00': true, '16:00': true, '17:00': true, '18:00': false },
  MIÉ: { '08:00': false, '09:00': true, '10:00': true, '11:00': true, '12:00': false, '13:00': false, '14:00': true, '15:00': true, '16:00': true, '17:00': true, '18:00': false },
  JUE: { '08:00': false, '09:00': true, '10:00': true, '11:00': true, '12:00': false, '13:00': false, '14:00': true, '15:00': true, '16:00': true, '17:00': true, '18:00': false },
  VIE: { '08:00': false, '09:00': true, '10:00': true, '11:00': true, '12:00': false, '13:00': false, '14:00': true, '15:00': true, '16:00': true, '17:00': true, '18:00': false },
  SÁB: { '08:00': false, '09:00': false, '10:00': true, '11:00': true, '12:00': false, '13:00': false, '14:00': false, '15:00': false, '16:00': false, '17:00': false, '18:00': false },
  DOM: { '08:00': false, '09:00': false, '10:00': true, '11:00': true, '12:00': false, '13:00': false, '14:00': false, '15:00': false, '16:00': false, '17:00': false, '18:00': false },
};
