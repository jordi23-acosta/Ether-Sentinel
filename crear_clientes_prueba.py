"""
Script para crear clientes/dispositivos de prueba en MikroTik
Ejecutar desde la PC que tiene acceso al MikroTik
"""
import routeros_api

# Configuración
HOST = "38.60.224.188"
PORT = 8728
USERNAME = "admin"
PASSWORD = "Taller#Inv2"

# Dispositivos de prueba
dispositivos_prueba = [
    {
        'address': '192.168.88.10',
        'mac-address': '00:11:22:33:44:01',
        'server': 'dhcp1',
        'comment': 'iPhone 15 Pro - Juan'
    },
    {
        'address': '192.168.88.11',
        'mac-address': '00:11:22:33:44:02',
        'server': 'dhcp1',
        'comment': 'MacBook Pro - María'
    },
    {
        'address': '192.168.88.12',
        'mac-address': '00:11:22:33:44:03',
        'server': 'dhcp1',
        'comment': 'Samsung Galaxy S24 - Pedro'
    },
    {
        'address': '192.168.88.13',
        'mac-address': '00:11:22:33:44:04',
        'server': 'dhcp1',
        'comment': 'Laptop Dell - Ana'
    },
    {
        'address': '192.168.88.14',
        'mac-address': '00:11:22:33:44:05',
        'server': 'dhcp1',
        'comment': 'Smart TV Samsung - Sala'
    },
]

def main():
    print("=" * 50)
    print("CREAR CLIENTES DE PRUEBA EN MIKROTIK")
    print("=" * 50)
    print()
    
    # Conectar
    print(f"Conectando a {HOST}:{PORT}...")
    try:
        connection = routeros_api.RouterOsApiPool(
            HOST,
            username=USERNAME,
            password=PASSWORD,
            port=PORT,
            plaintext_login=True
        )
        api = connection.get_api()
        print("✅ Conectado correctamente")
        print()
    except Exception as e:
        print(f"❌ Error conectando: {e}")
        return
    
    # Obtener recurso ARP (tabla de dispositivos)
    arp = api.get_resource('/ip/arp')
    
    # Verificar si ya existen
    arp_existentes = arp.get()
    ips_existentes = [entry.get('address') for entry in arp_existentes]
    
    print("Creando dispositivos de prueba en tabla ARP...")
    print()
    
    for dispositivo in dispositivos_prueba:
        ip = dispositivo['address']
        
        if ip in ips_existentes:
            print(f"⚠️  {ip} - Ya existe, saltando...")
            continue
        
        try:
            arp.add(
                address=dispositivo['address'],
                mac_address=dispositivo['mac-address'],
                interface='ether5',
                comment=dispositivo['comment']
            )
            print(f"✅ {ip} - {dispositivo['comment']} - Creado")
        except Exception as e:
            print(f"❌ {ip} - Error: {e}")
    
    print()
    print("=" * 50)
    print("RESUMEN")
    print("=" * 50)
    
    # Listar todos los dispositivos
    dispositivos = arp.get()
    print(f"\nTotal de dispositivos: {len(dispositivos)}")
    print("\nDispositivos registrados:")
    for device in dispositivos:
        ip = device.get('address', 'N/A')
        mac = device.get('mac-address', 'N/A')
        comment = device.get('comment', 'Sin nombre')
        interface = device.get('interface', 'N/A')
        print(f"  • {ip} - {mac} - {comment} - Interface: {interface}")
    
    print()
    print("✅ Listo! Ahora recarga el panel web para ver los dispositivos")
    
    connection.disconnect()

if __name__ == "__main__":
    main()
