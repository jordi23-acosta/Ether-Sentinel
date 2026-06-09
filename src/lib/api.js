/**
 * Cliente API para conectar con el backend de Ether Sentinel
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Wrapper para fetch con manejo de errores
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Importante para enviar cookies de sesión
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// ========== AUTENTICACIÓN ==========

export async function login(username, password) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export async function register(username, password, email) {
  return fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  });
}

export async function logout() {
  return fetchAPI('/auth/logout', {
    method: 'POST',
  });
}

export async function getCurrentUser() {
  return fetchAPI('/auth/me');
}

export async function getUsers() {
  return fetchAPI('/auth/users');
}

// ========== DISPOSITIVOS ==========

export async function getDevices() {
  return fetchAPI('/devices');
}

export async function blockDevice(ip, comment) {
  return fetchAPI(`/devices/${ip}/block`, {
    method: 'POST',
    body: JSON.stringify({ comment }),
  });
}

export async function unblockDevice(ip) {
  return fetchAPI(`/devices/${ip}/unblock`, {
    method: 'POST',
  });
}

export async function getBlockedDevices() {
  return fetchAPI('/devices/blocked');
}

// ========== RED ==========

export async function getNetworkStatus() {
  return fetchAPI('/network/status');
}

export async function getNetworkTraffic() {
  return fetchAPI('/network/traffic');
}

export async function getInterfaces() {
  return fetchAPI('/network/interfaces');
}

// ========== CONTENIDO ==========

export async function getBlockedDomains() {
  return fetchAPI('/content/blocked-domains');
}

export async function blockDomain(domain) {
  return fetchAPI('/content/block-domain', {
    method: 'POST',
    body: JSON.stringify({ domain }),
  });
}

export async function unblockDomain(domain) {
  return fetchAPI(`/content/unblock-domain/${domain}`, {
    method: 'DELETE',
  });
}

export async function getFirewallRules() {
  return fetchAPI('/content/firewall-rules');
}

// ========== HORARIOS ==========

export async function getSchedule() {
  return fetchAPI('/schedule');
}

export async function updateSchedule(schedule) {
  return fetchAPI('/schedule', {
    method: 'PUT',
    body: JSON.stringify({ schedule }),
  });
}

export async function toggleScheduleCell(hour, day) {
  return fetchAPI(`/schedule/${hour}/${day}`, {
    method: 'PATCH',
  });
}
