import routeros_api

conn = routeros_api.RouterOsApiPool('38.60.224.188', username='admin', password='Taller#Inv2', port=8728, plaintext_login=True)
api = conn.get_api()
interfaces = api.get_resource('/interface')
print('Interfaces disponibles:')
for i in interfaces.get():
    print(f"  - {i.get('name')}")
