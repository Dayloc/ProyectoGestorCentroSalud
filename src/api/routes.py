from flask import Blueprint, request, jsonify
from api.models import db, Paciente, Medico, Laboratorio, Analitica, HistorialMedico, Farmaco, AlergiaFarmaco, User
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from functools import wraps

api = Blueprint('api', __name__)

# ----------------------
# Helpers bcrypt
# ----------------------

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# ----------------------
# Decorador roles
# ----------------------

def roles_permitidos(*roles):
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            if claims.get("tipo") not in roles:
                return jsonify({"message": "Acceso denegado"}), 403
            return f(*args, **kwargs)
        return wrapper
    return decorator

# ----------------------
# Hello
# ----------------------

@api.route('/hello', methods=['GET', 'POST'])
def handle_hello():
    return jsonify({"message": "Hello! This message comes from the backend."}), 200

# ----------------------
# Users
# ----------------------

@api.route("/register/user", methods=["POST"])
def register_user():
    data = request.json
    hashed_password = hash_password(data["password"])
    user = User.crear(email=data["email"], password=hashed_password)
    return jsonify({"message": "Usuario creado", "id": user.id, "email": user.email}), 201

@api.route("/login/user", methods=["POST"])
def login_user():
    data = request.json
    user = User.obtener_por_email(data["email"])
    if not user or not check_password(data["password"], user.password):
        return jsonify({"message": "Credenciales incorrectas"}), 401
    token = create_access_token(identity=str(user.id), additional_claims={"tipo": "user"})
    return jsonify({"id": user.id, "email": user.email, "token": token})

@api.route('/users', methods=["GET"])
@jwt_required()
def get_all_users():
    users = User.obtener_todos()
    return jsonify([user.to_dict() for user in users])

# ----------------------
# Pacientes
# ----------------------

@api.route("/register/paciente", methods=["POST"])
def register_paciente():
    data = request.json
    hashed_password = hash_password(data["password"])
    paciente = Paciente.crear(
        nombre=data["nombre"],
        email=data["email"],
        fecha_nacimiento=data["fecha_nacimiento"],
        password=hashed_password
    )
    return jsonify({"message": "Paciente creado", "id": paciente.id, "nombre": paciente.nombre}), 201

@api.route("/login/paciente", methods=["POST"])
def login_paciente():
    data = request.json
    paciente = Paciente.obtener_por_email(data["email"])
    if not paciente or not check_password(data["password"], paciente.password):
        return jsonify({"message": "Credenciales incorrectas"}), 401
    token = create_access_token(identity=str(paciente.id), additional_claims={"tipo": "paciente", "nombre": paciente.nombre})
    return jsonify({"id": paciente.id, "nombre": paciente.nombre, "token": token})

@api.route("/paciente/me", methods=["GET"])
@roles_permitidos("paciente")
def get_mi_paciente():
    paciente_id = int(get_jwt_identity())
    paciente = Paciente.obtener_por_id(paciente_id)
    if not paciente:
        return jsonify({"message": "Paciente no encontrado"}), 404
    return jsonify({
        "id": paciente.id,
        "nombre": paciente.nombre,
        "email": paciente.email,
        "fecha_nacimiento": str(paciente.fecha_nacimiento)
    }), 200

@api.route("/pacientes", methods=["GET"])
@jwt_required()
def get_pacientes():
    pacientes = Paciente.obtener_todos()
    return jsonify([{"id": p.id, "nombre": p.nombre, "email": p.email, "fecha_nacimiento": str(p.fecha_nacimiento)} for p in pacientes])

@api.route("/pacientes/<int:paciente_id>", methods=["GET"])
@jwt_required()
def paciente_por_id(paciente_id):
    p = Paciente.obtener_por_id(paciente_id)
    if not p:
        return jsonify({"error": "Paciente no encontrado"}), 404
    return jsonify({"id": p.id, "nombre": p.nombre, "email": p.email, "fecha_nacimiento": str(p.fecha_nacimiento)})

# ----------------------
# Médicos
# ----------------------

@api.route("/register/medico", methods=["POST"])
def register_medico():
    data = request.json
    hashed_password = hash_password(data["password"])
    medico = Medico.crear(
        nombre=data["nombre"],
        email=data["email"],
        especialidad=data.get("especialidad"),
        password=hashed_password
    )
    return jsonify({"message": "Médico creado", "id": medico.id, "nombre": medico.nombre, "email":medico.email}), 201

@api.route("/login/medico", methods=["POST"])
def login_medico():
    data = request.json
    medico = Medico.obtener_por_email(data["email"])
    if not medico or not check_password(data["password"], medico.password):
        return jsonify({"message": "Credenciales incorrectas"}), 401
    token = create_access_token(identity=str(medico.id), additional_claims={"tipo": "medico", "nombre": medico.nombre})
    return jsonify({"id": medico.id, "nombre": medico.nombre, "token": token})

@api.route("/medico/me", methods=["GET"])
@roles_permitidos("medico")
def get_mi_medico():
    medico_id = int(get_jwt_identity())
    medico = Medico.obtener_por_id(medico_id)
    if not medico:
        return jsonify({"message": "Médico no encontrado"}), 404
    return jsonify({
        "id": medico.id,
        "nombre": medico.nombre,
        "email": medico.email,
        "especialidad": medico.especialidad
    }), 200

@api.route("/medicos", methods=["GET"])

def get_medicos():
    medicos = Medico.obtener_todos()
    return jsonify([{"id": m.id, "nombre": m.nombre, "especialidad": m.especialidad} for m in medicos])

# ----------------------
# Laboratorios
# ----------------------

@api.route("/laboratorios", methods=["GET"])
@jwt_required()
def get_laboratorios():
    labs = Laboratorio.obtener_todos()
    return jsonify([{"id": l.id, "nombre": l.nombre, "direccion": l.direccion, "especialidad": l.especialidad} for l in labs])

@api.route("/laboratorios", methods=["POST"])
@roles_permitidos("medico")
def crear_laboratorio():
    data = request.json
    lab = Laboratorio.crear(nombre=data["nombre"], direccion=data.get("direccion"), especialidad=data.get("especialidad"))
    return jsonify({"id": lab.id, "nombre": lab.nombre, "direccion": lab.direccion, "especialidad": lab.especialidad})

# ----------------------
# Analíticas
# ----------------------

@api.route("/analiticas", methods=["GET"])
@jwt_required()
def get_analiticas():
    analiticas = Analitica.obtener_todas()
    return jsonify([{"id": a.id, "tipo": a.tipo, "resultado": a.resultado, "fecha": str(a.fecha), "paciente_id": a.paciente_id, "laboratorio_id": a.laboratorio_id} for a in analiticas])

@api.route("/analiticas", methods=["POST"])
@roles_permitidos("medico")
def crear_analitica():
    data = request.json
    a = Analitica.crear(tipo=data["tipo"], resultado=data["resultado"], fecha=data["fecha"], paciente_id=data["paciente_id"], laboratorio_id=data["laboratorio_id"])
    return jsonify({"id": a.id, "tipo": a.tipo, "resultado": a.resultado})

@api.route("/pacientes/<int:paciente_id>/analiticas", methods=["GET"])
@roles_permitidos("paciente", "medico")
def analiticas_por_paciente(paciente_id):
    identity = get_jwt_identity()
    if get_jwt()["tipo"] == "paciente" and int(identity) != paciente_id:
        return jsonify({"message": "Acceso denegado"}), 403
    analiticas = Analitica.obtener_por_paciente(paciente_id)
    return jsonify([{"id": a.id, "tipo": a.tipo, "resultado": a.resultado, "fecha": str(a.fecha), "laboratorio_id": a.laboratorio_id} for a in analiticas])

# ----------------------
# Historial Médico
# ----------------------

@api.route("/pacientes/<int:paciente_id>/historial", methods=["GET"])
@roles_permitidos("paciente", "medico")
def historial_por_paciente(paciente_id):
    identity = get_jwt_identity()
    if get_jwt()["tipo"] == "paciente" and int(identity) != paciente_id:
        return jsonify({"message": "Acceso denegado"}), 403
    historial = HistorialMedico.obtener_por_paciente(paciente_id)
    return jsonify([{"id": h.id, "descripcion": h.descripcion, "fecha": str(h.fecha)} for h in historial])

@api.route("/pacientes/<int:paciente_id>/historial", methods=["POST"])
@roles_permitidos("medico")
def crear_historial(paciente_id):
    data = request.json
    h = HistorialMedico.crear(descripcion=data["descripcion"], fecha=data["fecha"], paciente_id=paciente_id)
    return jsonify({"id": h.id, "descripcion": h.descripcion})

# ----------------------
# Fármacos
# ----------------------

@api.route("/farmacos", methods=["GET"])
@jwt_required()
def get_farmacos():
    farmacos = Farmaco.obtener_todos()
    return jsonify([{"id": f.id, "nombre": f.nombre, "descripcion": f.descripcion} for f in farmacos])

@api.route("/farmacos", methods=["POST"])
@roles_permitidos("medico")
def crear_farmaco():
    data = request.json
    f = Farmaco.crear(nombre=data["nombre"], descripcion=data.get("descripcion"))
    return jsonify({"id": f.id, "nombre": f.nombre, "descripcion": f.descripcion})

# ----------------------
# Alergias
# ----------------------

@api.route("/pacientes/<int:paciente_id>/alergias", methods=["GET"])
@roles_permitidos("paciente", "medico")
def alergias_por_paciente(paciente_id):
    identity = get_jwt_identity()
    if get_jwt()["tipo"] == "paciente" and int(identity) != paciente_id:
        return jsonify({"message": "Acceso denegado"}), 403
    alergias = AlergiaFarmaco.obtener_por_paciente(paciente_id)
    return jsonify([{"id": a.id, "farmaco_id": a.farmaco_id, "nivel_reaccion": a.nivel_reaccion} for a in alergias])

@api.route("/pacientes/<int:paciente_id>/alergias", methods=["POST"])
@roles_permitidos("medico")
def crear_alergia(paciente_id):
    data = request.json
    a = AlergiaFarmaco.crear(paciente_id=paciente_id, farmaco_id=data["farmaco_id"], nivel_reaccion=data["nivel_reaccion"])
    return jsonify({"id": a.id, "farmaco_id": a.farmaco_id, "nivel_reaccion": a.nivel_reaccion})
