import axios from 'axios';
import https from 'https';

/**
 * Cliente para la REST API de MikroTik CHR
 */
class MikroTikClient {
  constructor() {
    const protocol = process.env.MIKROTIK_USE_HTTPS === 'true' ? 'https' : 'http';
    const host = process.env.MIKROTIK_HOST;
    const port = process.env.MIKROTIK_PORT || 80;
    
    this.baseURL = `${protocol}://${host}:${port}/rest`;
    this.auth = {
      username: process.env.MIKROTIK_USER,
      password: process.env.MIKROTIK_PASSWORD
    };

    // Cliente axios configurado
    this.client = axios.create({
      baseURL: this.baseURL,
      auth: this.auth,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      },
      // Ignorar certificados SSL autofirmados
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    });

    // Interceptor para logging
    this.client.interceptors.request.use(
      config => {
        console.log(`→ MikroTik ${config.method.toUpperCase()} ${config.url}`);
        return config;
      },
      error => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      response => {
        console.log(`← MikroTik ${response.status} ${response.config.url}`);
        return response;
      },
      error => {
        if (error.response) {
          console.error(`← MikroTik ERROR ${error.response.status}: ${error.response.statusText}`);
        } else if (error.request) {
          console.error(`← MikroTik ERROR: Sin respuesta del servidor`);
        } else {
          console.error(`← MikroTik ERROR: ${error.message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request a la API
   */
  async get(endpoint) {
    try {
      const response = await this.client.get(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * POST request a la API
   */
  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * PUT request a la API
   */
  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * PATCH request a la API
   */
  async patch(endpoint, data = {}) {
    try {
      const response = await this.client.patch(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * DELETE request a la API
   */
  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Manejo de errores
   */
  handleError(error) {
    if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status;
      const message = error.response.data?.message || error.response.statusText;
      
      if (status === 401) {
        throw new Error('Credenciales de MikroTik incorrectas');
      } else if (status === 404) {
        throw new Error('Recurso no encontrado en MikroTik');
      } else {
        throw new Error(`Error MikroTik (${status}): ${message}`);
      }
    } else if (error.request) {
      // No hubo respuesta del servidor
      throw new Error('No se puede conectar con el MikroTik. Verifica que la API REST esté habilitada y el puerto abierto.');
    } else {
      // Error en la configuración de la request
      throw new Error(`Error de configuración: ${error.message}`);
    }
  }

  // ========== MÉTODOS ESPECÍFICOS ==========

  /**
   * Obtiene la identidad del sistema
   */
  async getSystemIdentity() {
    return await this.get('/system/identity');
  }

  /**
   * Obtiene recursos del sistema
   */
  async getSystemResources() {
    return await this.get('/system/resource');
  }

  /**
   * Obtiene la lista DHCP (dispositivos conectados)
   */
  async getDhcpLeases() {
    return await this.get('/ip/dhcp-server/lease');
  }

  /**
   * Obtiene la tabla ARP (dispositivos en la red)
   */
  async getArpList() {
    return await this.get('/ip/arp');
  }

  /**
   * Obtiene las interfaces de red
   */
  async getInterfaces() {
    return await this.get('/interface');
  }

  /**
   * Obtiene estadísticas de tráfico de una interfaz
   */
  async getInterfaceStats(interfaceName) {
    const interfaces = await this.getInterfaces();
    return interfaces.find(i => i.name === interfaceName);
  }

  /**
   * Obtiene la lista de direcciones del firewall
   */
  async getFirewallAddressList() {
    return await this.get('/ip/firewall/address-list');
  }

  /**
   * Añade una IP a la lista de bloqueo del firewall
   */
  async blockIP(ip, comment = 'Bloqueado desde Ether Sentinel') {
    return await this.post('/ip/firewall/address-list/add', {
      list: 'blocked',
      address: ip,
      comment: comment
    });
  }

  /**
   * Elimina una IP de la lista de bloqueo
   */
  async unblockIP(ip) {
    // Primero buscar el ID de la entrada
    const addressList = await this.getFirewallAddressList();
    const entry = addressList.find(item => item.address === ip && item.list === 'blocked');
    
    if (entry && entry['.id']) {
      return await this.delete(`/ip/firewall/address-list/${entry['.id']}`);
    } else {
      throw new Error(`IP ${ip} no encontrada en la lista de bloqueo`);
    }
  }

  /**
   * Obtiene reglas del firewall
   */
  async getFirewallRules() {
    return await this.get('/ip/firewall/filter');
  }

  /**
   * Obtiene configuración DNS
   */
  async getDnsSettings() {
    return await this.get('/ip/dns');
  }

  /**
   * Obtiene entradas DNS estáticas
   */
  async getDnsStatic() {
    return await this.get('/ip/dns/static');
  }

  /**
   * Añade una entrada DNS estática (para bloqueo de dominios)
   */
  async blockDomain(domain, redirectTo = '0.0.0.0') {
    return await this.post('/ip/dns/static/add', {
      name: domain,
      address: redirectTo,
      comment: 'Bloqueado desde Ether Sentinel'
    });
  }

  /**
   * Elimina una entrada DNS estática
   */
  async unblockDomain(domain) {
    const dnsStatic = await this.getDnsStatic();
    const entry = dnsStatic.find(item => item.name === domain);
    
    if (entry && entry['.id']) {
      return await this.delete(`/ip/dns/static/${entry['.id']}`);
    } else {
      throw new Error(`Dominio ${domain} no encontrado en DNS estático`);
    }
  }
}

// Exportar instancia única
export default new MikroTikClient();
