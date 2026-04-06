const express = require('express');
const cors = require('cors');
const arp = require('node-arp');
const { exec } = require('child_process');
const os = require('os');

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────
// BASE DE DATOS OUI LOCAL (fabricantes reales)
// Formato: 'XX:XX:XX' → { marca, tipo, icono }
// ─────────────────────────────────────────────
const OUI_DB = {
  // Apple
  'A4:C3:F0': { marca: 'Apple',   tipo: 'iPhone / iPad',  icono: '📱' },
  'F8:FF:C2': { marca: 'Apple',   tipo: 'MacBook',        icono: '💻' },
  'AC:BC:32': { marca: 'Apple',   tipo: 'MacBook',        icono: '💻' },
  '3C:22:FB': { marca: 'Apple',   tipo: 'iPhone',         icono: '📱' },
  '00:CD:FE': { marca: 'Apple',   tipo: 'iPhone',         icono: '📱' },
  'F0:18:98': { marca: 'Apple',   tipo: 'Apple TV',       icono: '📺' },
  'B8:78:2E': { marca: 'Apple',   tipo: 'iPhone',         icono: '📱' },
  'DC:2B:2A': { marca: 'Apple',   tipo: 'MacBook',        icono: '💻' },
  '98:01:A7': { marca: 'Apple',   tipo: 'iPhone',         icono: '📱' },
  'C8:2A:14': { marca: 'Apple',   tipo: 'iPhone',         icono: '📱' },
  '00:1A:2B': { marca: 'Apple',   tipo: 'Mac',            icono: '💻' },
  'A8:96:8A': { marca: 'Apple',   tipo: 'iPhone',         icono: '📱' },
  '70:EC:E4': { marca: 'Apple',   tipo: 'iPhone',         icono: '📱' },
  '34:AB:37': { marca: 'Apple',   tipo: 'iPhone',         icono: '📱' },
  'E0:B9:BA': { marca: 'Apple',   tipo: 'MacBook',        icono: '💻' },

  // Samsung
  '44:D8:32': { marca: 'Samsung', tipo: 'Smartphone',     icono: '📱' },
  '8C:77:12': { marca: 'Samsung', tipo: 'Smart TV',       icono: '📺' },
  'CC:07:AB': { marca: 'Samsung', tipo: 'Smartphone',     icono: '📱' },
  'F4:7B:5E': { marca: 'Samsung', tipo: 'Tablet',         icono: '📱' },
  '50:32:75': { marca: 'Samsung', tipo: 'Smartphone',     icono: '📱' },
  'B4:79:A7': { marca: 'Samsung', tipo: 'Smart TV',       icono: '📺' },
  '78:BD:BC': { marca: 'Samsung', tipo: 'Smartphone',     icono: '📱' },
  'A0:07:98': { marca: 'Samsung', tipo: 'Smartphone',     icono: '📱' },
  '8C:C8:CD': { marca: 'Samsung', tipo: 'Smartphone',     icono: '📱' },
  '40:0E:85': { marca: 'Samsung', tipo: 'Smartphone',     icono: '📱' },

  // Xiaomi
  'F8:A4:5F': { marca: 'Xiaomi',  tipo: 'Smartphone',     icono: '📱' },
  '28:6C:07': { marca: 'Xiaomi',  tipo: 'Smartphone',     icono: '📱' },
  '64:B4:73': { marca: 'Xiaomi',  tipo: 'Smartphone',     icono: '📱' },
  'AC:C1:EE': { marca: 'Xiaomi',  tipo: 'Smartphone',     icono: '📱' },
  '00:9E:C8': { marca: 'Xiaomi',  tipo: 'Smartphone',     icono: '📱' },
  '74:51:BA': { marca: 'Xiaomi',  tipo: 'Smartphone',     icono: '📱' },
  'FC:64:BA': { marca: 'Xiaomi',  tipo: 'Smartphone',     icono: '📱' },

  // Huawei
  '00:E0:FC': { marca: 'Huawei',  tipo: 'Smartphone',     icono: '📱' },
  '54:89:98': { marca: 'Huawei',  tipo: 'Smartphone',     icono: '📱' },
  'AC:E2:15': { marca: 'Huawei',  tipo: 'Router',         icono: '📡' },
  'C8:14:79': { marca: 'Huawei',  tipo: 'Smartphone',     icono: '📱' },
  '28:31:52': { marca: 'Huawei',  tipo: 'Smartphone',     icono: '📱' },
  '70:72:3C': { marca: 'Huawei',  tipo: 'Router',         icono: '📡' },

  // Intel (laptops/PCs con Wi-Fi Intel)
  '00:1B:21': { marca: 'Intel',   tipo: 'PC / Laptop',    icono: '💻' },
  '8C:8D:28': { marca: 'Intel',   tipo: 'PC / Laptop',    icono: '💻' },
  'A4:4C:C8': { marca: 'Intel',   tipo: 'PC / Laptop',    icono: '💻' },
  '10:02:B5': { marca: 'Intel',   tipo: 'PC / Laptop',    icono: '💻' },
  'D4:3B:04': { marca: 'Intel',   tipo: 'PC / Laptop',    icono: '💻' },

  // Dell
  'F8:DB:88': { marca: 'Dell',    tipo: 'Laptop',         icono: '💻' },
  '18:03:73': { marca: 'Dell',    tipo: 'PC',             icono: '🖥️' },
  'B8:CA:3A': { marca: 'Dell',    tipo: 'Laptop',         icono: '💻' },
  '14:18:77': { marca: 'Dell',    tipo: 'Laptop',         icono: '💻' },
  'D4:BE:D9': { marca: 'Dell',    tipo: 'PC',             icono: '🖥️' },

  // HP
  '3C:D9:2B': { marca: 'HP',      tipo: 'Laptop',         icono: '💻' },
  'B4:99:BA': { marca: 'HP',      tipo: 'Impresora',      icono: '🖨️' },
  'F0:45:92': { marca: 'HP',      tipo: 'Impresora',      icono: '🖨️' },
  '00:1F:29': { marca: 'HP',      tipo: 'PC',             icono: '🖥️' },
  'A0:D3:C1': { marca: 'HP',      tipo: 'Laptop',         icono: '💻' },
  '9C:B6:D0': { marca: 'HP',      tipo: 'Laptop',         icono: '💻' },

  // Lenovo
  '00:23:AE': { marca: 'Lenovo',  tipo: 'Laptop',         icono: '💻' },
  '54:EE:75': { marca: 'Lenovo',  tipo: 'Laptop',         icono: '💻' },
  'E8:6A:64': { marca: 'Lenovo',  tipo: 'Laptop',         icono: '💻' },
  '28:D2:44': { marca: 'Lenovo',  tipo: 'Laptop',         icono: '💻' },
  'F8:16:54': { marca: 'Lenovo',  tipo: 'Laptop',         icono: '💻' },

  // ASUS
  '00:1A:92': { marca: 'ASUS',    tipo: 'PC / Router',    icono: '🖥️' },
  '2C:FD:A1': { marca: 'ASUS',    tipo: 'Router',         icono: '📡' },
  'AC:9E:17': { marca: 'ASUS',    tipo: 'Laptop',         icono: '💻' },
  '10:7B:44': { marca: 'ASUS',    tipo: 'Router',         icono: '📡' },
  '50:46:5D': { marca: 'ASUS',    tipo: 'Laptop',         icono: '💻' },

  // TP-Link (routers/switches)
  'EC:08:6B': { marca: 'TP-Link', tipo: 'Router',         icono: '📡' },
  '50:C7:BF': { marca: 'TP-Link', tipo: 'Router',         icono: '📡' },
  'C0:25:E9': { marca: 'TP-Link', tipo: 'Router',         icono: '📡' },
  '14:CC:20': { marca: 'TP-Link', tipo: 'Router',         icono: '📡' },
  '98:DA:C4': { marca: 'TP-Link', tipo: 'Router',         icono: '📡' },
  '54:AF:97': { marca: 'TP-Link', tipo: 'Router',         icono: '📡' },

  // Netgear
  'A0:40:A0': { marca: 'Netgear', tipo: 'Router',         icono: '📡' },
  '20:E5:2A': { marca: 'Netgear', tipo: 'Router',         icono: '📡' },
  'C4:04:15': { marca: 'Netgear', tipo: 'Router',         icono: '📡' },

  // D-Link
  '00:26:5A': { marca: 'D-Link',  tipo: 'Router',         icono: '📡' },
  '1C:7E:E5': { marca: 'D-Link',  tipo: 'Router',         icono: '📡' },
  'B0:C5:54': { marca: 'D-Link',  tipo: 'Router',         icono: '📡' },

  // Google (Chromecast, Nest, Pixel)
  '54:60:09': { marca: 'Google',  tipo: 'Chromecast',     icono: '📺' },
  'F4:F5:D8': { marca: 'Google',  tipo: 'Google Home',    icono: '🔊' },
  '3C:5A:B4': { marca: 'Google',  tipo: 'Chromecast',     icono: '📺' },
  'A4:77:33': { marca: 'Google',  tipo: 'Pixel Phone',    icono: '📱' },
  '94:EB:2C': { marca: 'Google',  tipo: 'Nest',           icono: '🏠' },

  // Amazon (Echo, Fire TV)
  'FC:65:DE': { marca: 'Amazon',  tipo: 'Echo / Alexa',   icono: '🔊' },
  '44:65:0D': { marca: 'Amazon',  tipo: 'Fire TV',        icono: '📺' },
  '74:C2:46': { marca: 'Amazon',  tipo: 'Echo',           icono: '🔊' },
  '68:37:E9': { marca: 'Amazon',  tipo: 'Fire Tablet',    icono: '📱' },

  // Sony (TV, PlayStation)
  '00:13:A9': { marca: 'Sony',    tipo: 'PlayStation',    icono: '🎮' },
  'F8:D0:AC': { marca: 'Sony',    tipo: 'Smart TV',       icono: '📺' },
  '10:4F:A8': { marca: 'Sony',    tipo: 'Smart TV',       icono: '📺' },
  'AC:9B:0A': { marca: 'Sony',    tipo: 'PlayStation',    icono: '🎮' },

  // LG (TV)
  'A8:23:FE': { marca: 'LG',      tipo: 'Smart TV',       icono: '📺' },
  'CC:2D:8C': { marca: 'LG',      tipo: 'Smart TV',       icono: '📺' },
  '78:5D:C8': { marca: 'LG',      tipo: 'Smart TV',       icono: '📺' },

  // Nintendo
  '00:1F:32': { marca: 'Nintendo',tipo: 'Nintendo Switch', icono: '🎮' },
  '98:B6:E9': { marca: 'Nintendo',tipo: 'Nintendo Switch', icono: '🎮' },
  'E0:E7:51': { marca: 'Nintendo',tipo: 'Nintendo Switch', icono: '🎮' },

  // Raspberry Pi
  'B8:27:EB': { marca: 'Raspberry Pi', tipo: 'Raspberry Pi', icono: '🍓' },
  'DC:A6:32': { marca: 'Raspberry Pi', tipo: 'Raspberry Pi', icono: '🍓' },
  'E4:5F:01': { marca: 'Raspberry Pi', tipo: 'Raspberry Pi', icono: '🍓' },

  // VMware / VirtualBox (máquinas virtuales)
  '00:0C:29': { marca: 'VMware',  tipo: 'Máquina Virtual', icono: '🖥️' },
  '00:50:56': { marca: 'VMware',  tipo: 'Máquina Virtual', icono: '🖥️' },
  '08:00:27': { marca: 'VirtualBox', tipo: 'Máquina Virtual', icono: '🖥️' },
};

// ─────────────────────────────────────────────
// Busca en la DB local primero, luego API online
// ─────────────────────────────────────────────
function identificarLocal(mac) {
  if (!mac || mac === 'N/A') return null;
  const macNorm = mac.toUpperCase().replace(/-/g, ':');
  const oui = macNorm.substring(0, 8);
  if (OUI_DB[oui]) return OUI_DB[oui];
  // Intento parcial con 2 octetos
  const oui2 = macNorm.substring(0, 5);
  for (const [key, val] of Object.entries(OUI_DB)) {
    if (key.startsWith(oui2)) return val;
  }
  return null;
}

// Deduce tipo e icono a partir del nombre del fabricante (para resultados de la API)
function deducirTipo(fabricante) {
  const f = fabricante.toLowerCase();
  if (f.includes('apple'))                          return { tipo: 'Apple',        icono: '🍎' };
  if (f.includes('samsung'))                        return { tipo: 'Samsung',      icono: '📱' };
  if (f.includes('huawei'))                         return { tipo: 'Router/Móvil', icono: '📡' };
  if (f.includes('xiaomi'))                         return { tipo: 'Smartphone',   icono: '📱' };
  if (f.includes('intel'))                          return { tipo: 'PC / Laptop',  icono: '💻' };
  if (f.includes('dell'))                           return { tipo: 'Laptop / PC',  icono: '💻' };
  if (f.includes('hewlett') || f.includes('hp '))   return { tipo: 'HP',           icono: '💻' };
  if (f.includes('lenovo'))                         return { tipo: 'Laptop',       icono: '💻' };
  if (f.includes('asus'))                           return { tipo: 'ASUS',         icono: '💻' };
  if (f.includes('tp-link') || f.includes('tplink'))return { tipo: 'Router',       icono: '📡' };
  if (f.includes('netgear'))                        return { tipo: 'Router',       icono: '📡' };
  if (f.includes('d-link') || f.includes('dlink'))  return { tipo: 'Router',       icono: '📡' };
  if (f.includes('cisco'))                          return { tipo: 'Switch/Router', icono: '📡' };
  if (f.includes('google'))                         return { tipo: 'Google',       icono: '📺' };
  if (f.includes('amazon'))                         return { tipo: 'Amazon',       icono: '🔊' };
  if (f.includes('sony'))                           return { tipo: 'Sony',         icono: '📺' };
  if (f.includes('lg elect'))                       return { tipo: 'Smart TV',     icono: '📺' };
  if (f.includes('nintendo'))                       return { tipo: 'Consola',      icono: '🎮' };
  if (f.includes('raspberry'))                      return { tipo: 'Raspberry Pi', icono: '🍓' };
  if (f.includes('vmware') || f.includes('virtual'))return { tipo: 'VM',           icono: '🖥️' };
  if (f.includes('espressif'))                      return { tipo: 'IoT / ESP',    icono: '🔌' };
  if (f.includes('realtek'))                        return { tipo: 'PC / Laptop',  icono: '💻' };
  if (f.includes('broadcom'))                       return { tipo: 'PC / Laptop',  icono: '💻' };
  return { tipo: 'Dispositivo', icono: '🖥️' };
}

// Consulta la API pública de macvendors.com con caché y rate limit
async function lookupMacOnline(mac) {
  const oui = mac.toUpperCase().replace(/-/g, ':').substring(0, 8);

  // Devolver desde caché si ya fue consultada
  if (macCache.has(oui)) return macCache.get(oui);

  try {
    await sleep(1200); // respetar rate limit: máx ~1 req/seg
    const res = await fetch(`https://api.macvendors.com/${oui}`, { signal: AbortSignal.timeout(4000) });

    if (res.status === 429) {
      console.log(`   ⚠️  Rate limit alcanzado para ${oui}, reintentando en 3s...`);
      await sleep(3000);
      const res2 = await fetch(`https://api.macvendors.com/${oui}`, { signal: AbortSignal.timeout(4000) });
      if (!res2.ok) { macCache.set(oui, null); return null; }
      const fabricante = (await res2.text()).trim();
      const result = buildResult(fabricante);
      macCache.set(oui, result);
      return result;
    }

    if (!res.ok) { macCache.set(oui, null); return null; }
    const fabricante = (await res.text()).trim();
    if (!fabricante || fabricante.includes('errors')) { macCache.set(oui, null); return null; }
    const result = buildResult(fabricante);
    macCache.set(oui, result);
    return result;
  } catch {
    macCache.set(oui, null);
    return null;
  }
}

function buildResult(fabricante) {
  const { tipo, icono } = deducirTipo(fabricante);
  // Acortar nombres muy largos
  const marca = fabricante.length > 30 ? fabricante.substring(0, 30) + '...' : fabricante;
  return { marca, tipo, icono, nombre: `${marca}` };
}

async function identificarDispositivo(mac) {
  if (!mac || mac === 'N/A') {
    return { marca: 'Sin MAC', tipo: 'Dispositivo', icono: '❓', nombre: 'Dispositivo Desconocido' };
  }

  // Detectar MAC aleatoria (bit LAA activo = privacidad del SO)
  const primerOcteto = parseInt(mac.split(':')[0], 16);
  if (primerOcteto & 2) {
    return { marca: 'MAC Aleatoria', tipo: 'Privacidad activada', icono: '🔒', nombre: 'Dispositivo (MAC privada)' };
  }

  // 1. Buscar en DB local (instantáneo)
  const local = identificarLocal(mac);
  if (local) return { marca: local.marca, tipo: local.tipo, icono: local.icono, nombre: `${local.marca} ${local.tipo}` };

  // 2. Consultar API online como fallback
  const online = await lookupMacOnline(mac);
  if (online) return online;

  return { marca: 'Desconocido', tipo: 'Dispositivo de Red', icono: '🖥️', nombre: 'Dispositivo de Red' };
}

// ─────────────────────────────────────────────
// Utilidades de red
// ─────────────────────────────────────────────
function getLocalSubnet() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        const parts = iface.address.split('.');
        return { subnet: `${parts[0]}.${parts[1]}.${parts[2]}`, myIp: iface.address };
      }
    }
  }
  return { subnet: '192.168.1', myIp: '192.168.1.1' };
}

function pingHost(ip) {
  return new Promise((resolve) => {
    exec(`ping -n 1 -w 400 ${ip}`, (err, stdout) => {
      resolve(!err && stdout.includes('TTL='));
    });
  });
}

function getMac(ip) {
  return new Promise((resolve) => {
    arp.getMAC(ip, (err, mac) => {
      resolve(err ? 'N/A' : mac);
    });
  });
}

// Caché de MACs ya consultadas (evita repetir llamadas a la API)
const macCache = new Map();

// Espera N milisegundos
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Estado en memoria para bloqueos
const bloqueados = new Set();

// ─────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────

// GET /api/dispositivos — escanea la red
app.get('/api/dispositivos', async (req, res) => {
  const { subnet, myIp } = getLocalSubnet();
  console.log(`\n🔍 Escaneando ${subnet}.1 - ${subnet}.254 ...`);

  const ips = Array.from({ length: 254 }, (_, i) => `${subnet}.${i + 1}`);
  const activos = [];

  // Lotes de 25 pings simultáneos
  for (let i = 0; i < ips.length; i += 25) {
    const lote = ips.slice(i, i + 25);
    const resultados = await Promise.all(lote.map(async (ip) => ({
      ip,
      activo: await pingHost(ip),
    })));
    activos.push(...resultados.filter(r => r.activo));
  }

  // Obtener MAC e identificar cada dispositivo
  const dispositivos = await Promise.all(
    activos.map(async ({ ip }, idx) => {
      const mac = await getMac(ip);
      const info = ip === myIp
        ? { marca: 'Este Equipo', tipo: 'Tu PC', icono: '🖥️', nombre: 'Este Equipo (Tú)' }
        : await identificarDispositivo(mac);

      return {
        id: idx + 1,
        nombre: nombresPersonalizados.get(ip) || info.nombre,
        nombreOriginal: info.nombre,
        nombrePersonalizado: nombresPersonalizados.has(ip),
        marca: info.marca,
        tipo: info.tipo,
        icono: info.icono,
        ip,
        mac: mac || 'N/A',
        estado: !bloqueados.has(ip),
        visto: 'Activo ahora',
      };
    })
  );

  console.log(`✅ Encontrados: ${dispositivos.length} dispositivos`);
  dispositivos.forEach(d => console.log(`   ${d.icono} ${d.nombre.padEnd(25)} ${d.ip.padEnd(16)} ${d.mac}`));

  res.json(dispositivos);
});

// Nombres personalizados por IP (persisten mientras el server corra)
const nombresPersonalizados = new Map();

// PATCH /api/dispositivos/:ip/nombre — guardar nombre personalizado
app.patch('/api/dispositivos/:ip/nombre', (req, res) => {
  const { ip } = req.params;
  const { nombre } = req.body;
  if (!nombre || !nombre.trim()) return res.status(400).json({ error: 'Nombre vacío' });
  nombresPersonalizados.set(ip, nombre.trim());
  res.json({ ok: true, ip, nombre: nombre.trim() });
});


app.post('/api/dispositivos/:ip/toggle', (req, res) => {
  const { ip } = req.params;
  if (bloqueados.has(ip)) {
    bloqueados.delete(ip);
    res.json({ estado: true, mensaje: `${ip} desbloqueado` });
  } else {
    bloqueados.add(ip);
    res.json({ estado: false, mensaje: `${ip} bloqueado` });
  }
});

// GET /api/red
app.get('/api/red', (req, res) => {
  const { subnet, myIp } = getLocalSubnet();
  res.json({ subnet, myIp, activa: true });
});

// ─────────────────────────────────────────────
// CONTROL DE CONTENIDO — archivo hosts real
// ─────────────────────────────────────────────
const fs = require('fs');
const HOSTS_PATH = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
const MARKER_START = '# === ETHER SENTINEL START ===';
const MARKER_END   = '# === ETHER SENTINEL END ===';

// Lee los dominios bloqueados actualmente en el archivo hosts
function leerBloqueadosHosts() {
  try {
    const contenido = fs.readFileSync(HOSTS_PATH, 'utf8');
    const inicio = contenido.indexOf(MARKER_START);
    const fin    = contenido.indexOf(MARKER_END);
    if (inicio === -1 || fin === -1) return [];
    const bloque = contenido.substring(inicio + MARKER_START.length, fin);
    return bloque.split('\n')
      .map(l => l.trim())
      .filter(l => l.startsWith('0.0.0.0'))
      .map(l => l.replace('0.0.0.0', '').trim());
  } catch { return []; }
}

// Escribe la lista de dominios bloqueados en el archivo hosts
function escribirHosts(dominios) {
  try {
    let contenido = fs.readFileSync(HOSTS_PATH, 'utf8');
    // Eliminar bloque anterior si existe
    const inicio = contenido.indexOf(MARKER_START);
    const fin    = contenido.indexOf(MARKER_END);
    if (inicio !== -1 && fin !== -1) {
      contenido = contenido.substring(0, inicio) + contenido.substring(fin + MARKER_END.length);
    }
    contenido = contenido.trimEnd();
    if (dominios.length > 0) {
      const lineas = dominios.map(d => `0.0.0.0 ${d}\n0.0.0.0 www.${d}`).join('\n');
      contenido += `\n\n${MARKER_START}\n${lineas}\n${MARKER_END}\n`;
    }
    fs.writeFileSync(HOSTS_PATH, contenido, 'utf8');
    // Limpiar caché DNS de Windows
    exec('ipconfig /flushdns', () => {});
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// GET /api/contenido — devuelve listas actuales
app.get('/api/contenido', (req, res) => {
  res.json({
    bloqueados: leerBloqueadosHosts(),
    permitidos: contenidoPermitidos,
  });
});

// Estado en memoria para permitidos (hosts no los necesita)
let contenidoPermitidos = ['google.com', 'aws.amazon.com', 'github.com'];

// POST /api/contenido/bloquear
app.post('/api/contenido/bloquear', (req, res) => {
  const { dominio } = req.body;
  if (!dominio) return res.status(400).json({ error: 'Dominio requerido' });
  const lista = leerBloqueadosHosts();
  if (!lista.includes(dominio)) lista.push(dominio);
  const result = escribirHosts(lista);
  if (!result.ok) return res.status(500).json({ error: 'Sin permisos de administrador. Ejecuta el servidor como admin.', detalle: result.error });
  console.log(`🚫 Bloqueado: ${dominio}`);
  res.json({ ok: true, bloqueados: lista });
});

// DELETE /api/contenido/bloquear/:dominio
app.delete('/api/contenido/bloquear/:dominio', (req, res) => {
  const dominio = decodeURIComponent(req.params.dominio);
  const lista = leerBloqueadosHosts().filter(d => d !== dominio);
  const result = escribirHosts(lista);
  if (!result.ok) return res.status(500).json({ error: 'Sin permisos de administrador.', detalle: result.error });
  console.log(`✅ Desbloqueado: ${dominio}`);
  res.json({ ok: true, bloqueados: lista });
});

// POST /api/contenido/permitir
app.post('/api/contenido/permitir', (req, res) => {
  const { dominio } = req.body;
  if (!dominio) return res.status(400).json({ error: 'Dominio requerido' });
  if (!contenidoPermitidos.includes(dominio)) contenidoPermitidos.push(dominio);
  res.json({ ok: true, permitidos: contenidoPermitidos });
});

// DELETE /api/contenido/permitir/:dominio
app.delete('/api/contenido/permitir/:dominio', (req, res) => {
  const dominio = decodeURIComponent(req.params.dominio);
  contenidoPermitidos = contenidoPermitidos.filter(d => d !== dominio);
  res.json({ ok: true, permitidos: contenidoPermitidos });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\n🛡️  Ether Sentinel Server → http://localhost:${PORT}\n`);
});
