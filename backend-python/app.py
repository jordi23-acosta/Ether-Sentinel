"""
Backend API para Ether Sentinel
Conecta con MikroTik RouterOS API
"""
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from mikrotik_client import mikrotik
import os
from dotenv import load_dotenv
from database import init_db, authenticate_user, create_user, get_all_users, update_password

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY', 'ether-sentinel-secret-key-change-in-production')
CORS(app, supports_credentials=True)  # Habilitar CORS con credenciales

# Inicializar base de datos
init_db()

# Conectar al MikroTik al iniciar
@app.before_request
def before_request():
    if not mikrotik.api:
        mikrotik.connect()

# ========== AUTENTICACIÓN ==========

@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login de usuario"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': 'Usuario y contraseña requeridos'}), 400
        
        user = authenticate_user(username, password)
        
        if user:
            session['user_id'] = user['id']
            session['username'] = user['username']
            return jsonify({
                'success': True,
                'user': user
            })
        else:
            return jsonify({'error': 'Usuario o contraseña incorrectos'}), 401
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Registro de nuevo usuario"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        
        if not username or not password:
            return jsonify({'error': 'Usuario y contraseña requeridos'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'La contraseña debe tener al menos 6 caracteres'}), 400
        
        user = create_user(username, password, email)
        
        return jsonify({
            'success': True,
            'message': 'Usuario creado correctamente',
            'user': user
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout de usuario"""
    session.clear()
    return jsonify({'success': True, 'message': 'Sesión cerrada'})

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    """Obtiene el usuario actual"""
    if 'user_id' in session:
        return jsonify({
            'id': session['user_id'],
            'username': session['username']
        })
    return jsonify({'error': 'No autenticado'}), 401

@app.route('/api/auth/users', methods=['GET'])
def list_users():
    """Lista todos los usuarios (solo para admin)"""
    if 'username' not in session or session['username'] != 'admin':
        return jsonify({'error': 'No autorizado'}), 403
    
    users = get_all_users()
    return jsonify(users)

# ========== HEALTH CHECK ==========

@app.route('/health', methods=['GET'])
def health():
    """Verifica que el servidor esté funcionando"""
    return jsonify({
        'status': 'ok',
        'mikrotik': {
            'host': mikrotik.host,
            'port': mikrotik.port,
            'connected': mikrotik.api is not None
        }
    })

# ========== DISPOSITIVOS ==========

@app.route('/api/devices', methods=['GET'])
def get_devices():
    """Obtiene la lista de dispositivos conectados"""
    try:
        # Usar ARP en lugar de DHCP leases
        arp_list = mikrotik.get_arp_list()
        firewall_rules = mikrotik.get_firewall_rules()
        
        # Crear set de IPs bloqueadas
        blocked_ips = set()
        for rule in firewall_rules:
            if rule.get('action') == 'drop' and rule.get('src-address'):
                blocked_ips.add(rule.get('src-address'))
        
        # Procesar dispositivos
        devices = []
        for entry in arp_list:
            ip = entry.get('address', '')
            mac = entry.get('mac-address', '')
            
            device = {
                'id': entry.get('.id'),
                'name': entry.get('comment') or f'Dispositivo {ip}',
                'ip': ip,
                'mac': mac,
                'status': not entry.get('invalid', False),
                'lastSeen': 'Conectado' if not entry.get('invalid') else 'Desconectado',
                'type': entry.get('interface', 'Desconocido'),
                'blocked': ip in blocked_ips
            }
            devices.append(device)
        
        return jsonify(devices)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/devices/<ip>/block', methods=['POST'])
def block_device(ip):
    """Bloquea un dispositivo por IP"""
    try:
        data = request.get_json() or {}
        comment = data.get('comment', 'Bloqueado desde Ether Sentinel')
        
        mikrotik.block_ip(ip, comment)
        
        return jsonify({
            'success': True,
            'message': f'Dispositivo {ip} bloqueado correctamente',
            'ip': ip
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/devices/<ip>/unblock', methods=['POST'])
def unblock_device(ip):
    """Desbloquea un dispositivo por IP"""
    try:
        mikrotik.unblock_ip(ip)
        
        return jsonify({
            'success': True,
            'message': f'Dispositivo {ip} desbloqueado correctamente',
            'ip': ip
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/devices/blocked', methods=['GET'])
def get_blocked_devices():
    """Obtiene la lista de IPs bloqueadas"""
    try:
        rules = mikrotik.get_firewall_rules()
        
        blocked = []
        for rule in rules:
            if rule.get('action') == 'drop' and rule.get('src-address'):
                blocked.append({
                    'id': rule.get('.id'),
                    'ip': rule.get('src-address'),
                    'comment': rule.get('comment', ''),
                })
        
        return jsonify(blocked)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== RED ==========

@app.route('/api/network/status', methods=['GET'])
def get_network_status():
    """Obtiene el estado general de la red"""
    try:
        identity = mikrotik.get_system_identity()
        resources = mikrotik.get_system_resource()
        interfaces = mikrotik.get_interfaces()
        
        # Calcular uptime legible
        uptime_str = resources.get('uptime', '0s')
        
        return jsonify({
            'identity': identity.get('name', 'MikroTik'),
            'uptime': uptime_str,
            'cpu': resources.get('cpu-load', '0'),
            'memory': {
                'total': resources.get('total-memory', 0),
                'free': resources.get('free-memory', 0),
            },
            'version': resources.get('version', 'Desconocido'),
            'interfaces': [{
                'name': iface.get('name'),
                'type': iface.get('type'),
                'running': iface.get('running') == 'true',
                'disabled': iface.get('disabled') == 'true',
            } for iface in interfaces]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/network/traffic', methods=['GET'])
def get_network_traffic():
    """Obtiene estadísticas de tráfico"""
    try:
        interfaces = mikrotik.get_interfaces()
        
        traffic = []
        totals = {'rxBytes': 0, 'txBytes': 0}
        
        for iface in interfaces:
            if iface.get('running') == 'true' and iface.get('disabled') != 'true':
                rx = int(iface.get('rx-byte', 0))
                tx = int(iface.get('tx-byte', 0))
                
                traffic.append({
                    'interface': iface.get('name'),
                    'type': iface.get('type'),
                    'rxBytes': rx,
                    'txBytes': tx,
                })
                
                totals['rxBytes'] += rx
                totals['txBytes'] += tx
        
        return jsonify({
            'interfaces': traffic,
            'totals': totals
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/network/interfaces', methods=['GET'])
def get_interfaces():
    """Lista todas las interfaces"""
    try:
        interfaces = mikrotik.get_interfaces()
        return jsonify(interfaces)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== CONTENIDO ==========

@app.route('/api/content/blocked-domains', methods=['GET'])
def get_blocked_domains():
    """Obtiene la lista de dominios bloqueados"""
    try:
        dns_entries = mikrotik.get_dns_static()
        
        blocked = []
        for entry in dns_entries:
            if entry.get('address') == '0.0.0.0' or 'Bloqueado' in entry.get('comment', ''):
                blocked.append({
                    'id': entry.get('.id'),
                    'domain': entry.get('name'),
                    'comment': entry.get('comment', '')
                })
        
        return jsonify(blocked)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/content/block-domain', methods=['POST'])
def block_domain():
    """Bloquea un dominio"""
    try:
        data = request.get_json()
        domain = data.get('domain')
        
        if not domain:
            return jsonify({'error': 'El campo domain es requerido'}), 400
        
        mikrotik.block_domain(domain)
        
        return jsonify({
            'success': True,
            'message': f'Dominio {domain} bloqueado correctamente',
            'domain': domain
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/content/unblock-domain/<domain>', methods=['DELETE'])
def unblock_domain(domain):
    """Desbloquea un dominio"""
    try:
        mikrotik.unblock_domain(domain)
        
        return jsonify({
            'success': True,
            'message': f'Dominio {domain} desbloqueado correctamente',
            'domain': domain
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/content/firewall-rules', methods=['GET'])
def get_firewall_rules():
    """Obtiene las reglas del firewall"""
    try:
        rules = mikrotik.get_firewall_rules()
        return jsonify(rules)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== HORARIOS ==========

# Almacenamiento temporal en memoria
schedules = {
    '08:00': [False, False, False, False, False, False, False],
    '09:00': [True,  True,  True,  True,  True,  False, False],
    '10:00': [True,  True,  True,  True,  True,  True,  True ],
    '11:00': [True,  True,  True,  True,  True,  True,  True ],
    '12:00': [False, False, False, False, False, False, False],
    '13:00': [True,  True,  True,  True,  True,  False, False],
    '14:00': [True,  True,  True,  True,  True,  False, False],
    '15:00': [True,  True,  True,  True,  True,  False, False],
    '16:00': [True,  True,  True,  True,  True,  False, False],
    '17:00': [False, False, False, False, False, False, False],
}

@app.route('/api/schedule', methods=['GET'])
def get_schedule():
    """Obtiene el horario actual"""
    return jsonify(schedules)

@app.route('/api/schedule', methods=['PUT'])
def update_schedule():
    """Actualiza el horario completo"""
    global schedules
    data = request.get_json()
    schedule = data.get('schedule')
    
    if not schedule:
        return jsonify({'error': 'Formato de horario inválido'}), 400
    
    schedules = schedule
    
    return jsonify({
        'success': True,
        'message': 'Horario actualizado correctamente',
        'schedule': schedules
    })

@app.route('/api/schedule/<hour>/<int:day>', methods=['PATCH'])
def toggle_schedule_cell(hour, day):
    """Alterna una celda específica del horario"""
    if hour not in schedules:
        return jsonify({'error': 'Hora no encontrada'}), 404
    
    if day < 0 or day > 6:
        return jsonify({'error': 'Día inválido (0-6)'}), 400
    
    schedules[hour][day] = not schedules[hour][day]
    
    return jsonify({
        'success': True,
        'hour': hour,
        'day': day,
        'active': schedules[hour][day]
    })

# ========== INICIAR SERVIDOR ==========

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3001))
    print(f"\n🚀 Backend corriendo en http://localhost:{port}")
    print(f"📡 MikroTik: {mikrotik.host}:{mikrotik.port}")
    print(f"🔐 Usuario: {mikrotik.username}\n")
    
    app.run(host='0.0.0.0', port=port, debug=True)
