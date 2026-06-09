import express from 'express';
import mikrotik from '../lib/mikrotik.js';

const router = express.Router();

/**
 * GET /api/network/status
 * Obtiene el estado general de la red
 */
router.get('/status', async (req, res, next) => {
  try {
    const [identity, resources, interfaces] = await Promise.all([
      mikrotik.getSystemIdentity(),
      mikrotik.getSystemResources(),
      mikrotik.getInterfaces()
    ]);

    // Calcular uptime en formato legible
    const uptimeSeconds = parseInt(resources.uptime);
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);

    res.json({
      identity: identity.name,
      uptime: `${days}d ${hours}h ${minutes}m`,
      uptimeSeconds,
      cpu: resources['cpu-load'],
      memory: {
        total: resources['total-memory'],
        free: resources['free-memory'],
        used: resources['total-memory'] - resources['free-memory']
      },
      version: resources.version,
      interfaces: interfaces.map(iface => ({
        name: iface.name,
        type: iface.type,
        running: iface.running === 'true',
        disabled: iface.disabled === 'true',
        rxBytes: iface['rx-byte'] || 0,
        txBytes: iface['tx-byte'] || 0
      }))
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/network/traffic
 * Obtiene estadísticas de tráfico
 */
router.get('/traffic', async (req, res, next) => {
  try {
    const interfaces = await mikrotik.getInterfaces();
    
    // Filtrar solo interfaces activas
    const activeInterfaces = interfaces.filter(i => i.running === 'true' && i.disabled !== 'true');

    const traffic = activeInterfaces.map(iface => ({
      interface: iface.name,
      type: iface.type,
      rxBytes: parseInt(iface['rx-byte'] || 0),
      txBytes: parseInt(iface['tx-byte'] || 0),
      rxPackets: parseInt(iface['rx-packet'] || 0),
      txPackets: parseInt(iface['tx-packet'] || 0),
      rxErrors: parseInt(iface['rx-error'] || 0),
      txErrors: parseInt(iface['tx-error'] || 0)
    }));

    // Calcular totales
    const totals = traffic.reduce((acc, curr) => ({
      rxBytes: acc.rxBytes + curr.rxBytes,
      txBytes: acc.txBytes + curr.txBytes,
      rxPackets: acc.rxPackets + curr.rxPackets,
      txPackets: acc.txPackets + curr.txPackets
    }), { rxBytes: 0, txBytes: 0, rxPackets: 0, txPackets: 0 });

    res.json({
      interfaces: traffic,
      totals
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/network/interfaces
 * Lista todas las interfaces
 */
router.get('/interfaces', async (req, res, next) => {
  try {
    const interfaces = await mikrotik.getInterfaces();
    res.json(interfaces);
  } catch (error) {
    next(error);
  }
});

export default router;
