import express from 'express';
import mikrotik from '../lib/mikrotik.js';

const router = express.Router();

/**
 * GET /api/devices
 * Obtiene la lista de dispositivos conectados
 */
router.get('/', async (req, res, next) => {
  try {
    // Obtener DHCP leases y ARP
    const [leases, arpList] = await Promise.all([
      mikrotik.getDhcpLeases(),
      mikrotik.getArpList()
    ]);

    // Combinar información
    const devices = leases.map(lease => {
      const arpEntry = arpList.find(arp => arp.address === lease.address);
      
      return {
        id: lease['.id'],
        name: lease['host-name'] || lease.comment || 'Dispositivo sin nombre',
        ip: lease.address,
        mac: lease['mac-address'] || lease['active-mac-address'],
        status: lease.status === 'bound',
        lastSeen: lease['last-seen'] || 'Desconocido',
        type: arpEntry?.interface || 'Desconocido',
        blocked: lease.disabled === 'true' || lease.disabled === true
      };
    });

    res.json(devices);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/devices/:ip/block
 * Bloquea un dispositivo por IP
 */
router.post('/:ip/block', async (req, res, next) => {
  try {
    const { ip } = req.params;
    const { comment } = req.body;

    await mikrotik.blockIP(ip, comment || `Bloqueado desde Ether Sentinel`);

    res.json({ 
      success: true, 
      message: `Dispositivo ${ip} bloqueado correctamente`,
      ip 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/devices/:ip/unblock
 * Desbloquea un dispositivo por IP
 */
router.post('/:ip/unblock', async (req, res, next) => {
  try {
    const { ip } = req.params;

    await mikrotik.unblockIP(ip);

    res.json({ 
      success: true, 
      message: `Dispositivo ${ip} desbloqueado correctamente`,
      ip 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/devices/blocked
 * Obtiene la lista de IPs bloqueadas
 */
router.get('/blocked', async (req, res, next) => {
  try {
    const addressList = await mikrotik.getFirewallAddressList();
    const blocked = addressList
      .filter(item => item.list === 'blocked')
      .map(item => ({
        id: item['.id'],
        ip: item.address,
        comment: item.comment || '',
        createdAt: item['creation-time'] || null
      }));

    res.json(blocked);
  } catch (error) {
    next(error);
  }
});

export default router;
