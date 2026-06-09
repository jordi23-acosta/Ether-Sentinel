import express from 'express';
import mikrotik from '../lib/mikrotik.js';

const router = express.Router();

/**
 * GET /api/content/blocked-domains
 * Obtiene la lista de dominios bloqueados
 */
router.get('/blocked-domains', async (req, res, next) => {
  try {
    const dnsStatic = await mikrotik.getDnsStatic();
    
    // Filtrar solo los bloqueados (los que apuntan a 0.0.0.0 o tienen comentario de bloqueo)
    const blocked = dnsStatic
      .filter(entry => 
        entry.address === '0.0.0.0' || 
        (entry.comment && entry.comment.includes('Bloqueado'))
      )
      .map(entry => ({
        id: entry['.id'],
        domain: entry.name,
        comment: entry.comment || ''
      }));

    res.json(blocked);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/content/block-domain
 * Bloquea un dominio
 */
router.post('/block-domain', async (req, res, next) => {
  try {
    const { domain } = req.body;

    if (!domain) {
      return res.status(400).json({ error: 'El campo domain es requerido' });
    }

    await mikrotik.blockDomain(domain);

    res.json({ 
      success: true, 
      message: `Dominio ${domain} bloqueado correctamente`,
      domain 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/content/unblock-domain/:domain
 * Desbloquea un dominio
 */
router.delete('/unblock-domain/:domain', async (req, res, next) => {
  try {
    const { domain } = req.params;

    await mikrotik.unblockDomain(domain);

    res.json({ 
      success: true, 
      message: `Dominio ${domain} desbloqueado correctamente`,
      domain 
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/content/firewall-rules
 * Obtiene las reglas del firewall
 */
router.get('/firewall-rules', async (req, res, next) => {
  try {
    const rules = await mikrotik.getFirewallRules();
    res.json(rules);
  } catch (error) {
    next(error);
  }
});

export default router;
