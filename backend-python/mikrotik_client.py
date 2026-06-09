"""
Cliente para conectarse a MikroTik RouterOS API
"""
import routeros_api
import os
from dotenv import load_dotenv

load_dotenv()

class MikroTikClient:
    def __init__(self):
        self.host = os.getenv('MIKROTIK_HOST')
        self.port = int(os.getenv('MIKROTIK_PORT', 8728))
        self.username = os.getenv('MIKROTIK_USER')
        self.password = os.getenv('MIKROTIK_PASSWORD')
        self.connection = None
        self.api = None
    
    def connect(self):
        """Conecta al MikroTik"""
        try:
            # Desconectar si ya hay una conexión
            if self.connection:
                try:
                    self.connection.disconnect()
                except:
                    pass
            
            self.connection = routeros_api.RouterOsApiPool(
                self.host,
                username=self.username,
                password=self.password,
                port=self.port,
                plaintext_login=True
            )
            self.api = self.connection.get_api()
            print(f"✅ Conectado a MikroTik {self.host}:{self.port}")
            return True
        except Exception as e:
            print(f"❌ Error conectando a MikroTik: {e}")
            self.api = None
            self.connection = None
            return False
    
    def ensure_connected(self):
        """Asegura que haya una conexión activa, reconecta si es necesario"""
        if not self.api:
            return self.connect()
        
        # Probar la conexión
        try:
            identity = self.api.get_resource('/system/identity')
            identity.get()
            return True
        except:
            print("⚠️ Conexión perdida, reconectando...")
            return self.connect()
    
    def disconnect(self):
        """Desconecta del MikroTik"""
        if self.connection:
            self.connection.disconnect()
            print("Desconectado de MikroTik")
    
    # ========== INTERFACES ==========
    
    def get_interfaces(self):
        """Obtiene la lista de interfaces"""
        try:
            interfaces = self.api.get_resource('/interface')
            return interfaces.get()
        except Exception as e:
            raise Exception(f"Error obteniendo interfaces: {e}")
    
    # ========== DIRECCIONES IP ==========
    
    def get_ip_addresses(self):
        """Obtiene las direcciones IP configuradas"""
        try:
            ip_addresses = self.api.get_resource('/ip/address')
            return ip_addresses.get()
        except Exception as e:
            raise Exception(f"Error obteniendo direcciones IP: {e}")
    
    # ========== DHCP LEASES (DISPOSITIVOS) ==========
    
    def get_dhcp_leases(self):
        """Obtiene la lista de dispositivos conectados (DHCP leases)"""
        try:
            self.ensure_connected()
            leases = self.api.get_resource('/ip/dhcp-server/lease')
            return leases.get()
        except Exception as e:
            raise Exception(f"Error obteniendo DHCP leases: {e}")
    
    def get_arp_list(self):
        """Obtiene la tabla ARP"""
        try:
            self.ensure_connected()
            arp = self.api.get_resource('/ip/arp')
            return arp.get()
        except Exception as e:
            raise Exception(f"Error obteniendo ARP: {e}")
    
    # ========== FIREWALL ==========
    
    def get_firewall_rules(self):
        """Obtiene las reglas del firewall"""
        try:
            firewall = self.api.get_resource('/ip/firewall/filter')
            return firewall.get()
        except Exception as e:
            raise Exception(f"Error obteniendo reglas de firewall: {e}")
    
    def block_ip(self, ip_address, comment="Bloqueado desde Ether Sentinel"):
        """Bloquea una IP añadiendo una regla de firewall"""
        try:
            firewall = self.api.get_resource('/ip/firewall/filter')
            firewall.add(
                chain='forward',
                src_address=ip_address,
                action='drop',
                comment=comment
            )
            print(f"✅ IP {ip_address} bloqueada")
            return True
        except Exception as e:
            raise Exception(f"Error bloqueando IP: {e}")
    
    def unblock_ip(self, ip_address):
        """Desbloquea una IP eliminando la regla del firewall"""
        try:
            firewall = self.api.get_resource('/ip/firewall/filter')
            rules = firewall.get()
            
            for rule in rules:
                if rule.get('src-address') == ip_address and rule.get('action') == 'drop':
                    firewall.remove(id=rule['.id'])
                    print(f"✅ IP {ip_address} desbloqueada")
                    return True
            
            raise Exception(f"No se encontró regla de bloqueo para {ip_address}")
        except Exception as e:
            raise Exception(f"Error desbloqueando IP: {e}")
    
    # ========== SISTEMA ==========
    
    def get_system_resource(self):
        """Obtiene recursos del sistema (CPU, RAM, uptime)"""
        try:
            resource = self.api.get_resource('/system/resource')
            return resource.get()[0] if resource.get() else {}
        except Exception as e:
            raise Exception(f"Error obteniendo recursos del sistema: {e}")
    
    def get_system_identity(self):
        """Obtiene la identidad del sistema"""
        try:
            identity = self.api.get_resource('/system/identity')
            return identity.get()[0] if identity.get() else {}
        except Exception as e:
            raise Exception(f"Error obteniendo identidad: {e}")
    
    # ========== DNS ==========
    
    def get_dns_static(self):
        """Obtiene entradas DNS estáticas"""
        try:
            dns = self.api.get_resource('/ip/dns/static')
            return dns.get()
        except Exception as e:
            raise Exception(f"Error obteniendo DNS estático: {e}")
    
    def block_domain(self, domain, redirect_to='0.0.0.0'):
        """Bloquea un dominio mediante DNS estático"""
        try:
            dns = self.api.get_resource('/ip/dns/static')
            dns.add(
                name=domain,
                address=redirect_to,
                comment='Bloqueado desde Ether Sentinel'
            )
            print(f"✅ Dominio {domain} bloqueado")
            return True
        except Exception as e:
            raise Exception(f"Error bloqueando dominio: {e}")
    
    def unblock_domain(self, domain):
        """Desbloquea un dominio eliminando la entrada DNS"""
        try:
            dns = self.api.get_resource('/ip/dns/static')
            entries = dns.get()
            
            for entry in entries:
                if entry.get('name') == domain:
                    dns.remove(id=entry['.id'])
                    print(f"✅ Dominio {domain} desbloqueado")
                    return True
            
            raise Exception(f"No se encontró entrada DNS para {domain}")
        except Exception as e:
            raise Exception(f"Error desbloqueando dominio: {e}")

# Instancia global
mikrotik = MikroTikClient()
