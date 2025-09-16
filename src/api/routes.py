from flask import Blueprint, request, jsonify
from api.models import db, Paciente, Medico, Laboratorio, Analitica, HistorialMedico, Farmaco, AlergiaFarmaco, User, Cita, ActividadMedico
import bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt 
from functools import wraps
from datetime import datetime,timedelta

api = Blueprint('api', __name__)


# Helpers bcrypt


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

# Decorador roles
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


# Hello

@api.route('/hello', methods=['GET', 'POST'])
def handle_hello():
    return jsonify({"message": "Hello! This message comes from the backend."}), 200


# Users

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


# Pacientes

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
    return jsonify(paciente.to_dict()), 200

@api.route("/pacientes", methods=["GET"])
def get_pacientes():
    pacientes = Paciente.obtener_todos()
    return jsonify([p.to_dict() for p in pacientes])

@api.route("/pacientes/<int:paciente_id>", methods=["GET"])
@jwt_required()
def paciente_por_id(paciente_id):
    paciente = Paciente.obtener_por_id(paciente_id)
    if not paciente:
        return jsonify({"error": "Paciente no encontrado"}), 404
    return jsonify(paciente.to_dict())


# Médicos

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
    return jsonify(medico.to_dict())

@api.route("/medicos", methods=["GET"])
def get_medicos():
    medicos = Medico.obtener_todos()
    return jsonify([m.to_dict() for m in medicos])


# Actividades de médicos

@api.route("/medicos/<int:medico_id>/actividades", methods=["POST"])
@roles_permitidos("medico")
def crear_actividad(medico_id):
    data = request.json
    act = ActividadMedico(
        titulo=data["titulo"],
        descripcion=data.get("descripcion"),
        fecha=data["fecha"],
        medico_id=medico_id
    )
    db.session.add(act)
    db.session.commit()
    return jsonify(act.to_dict())

@api.route("/medicos/<int:medico_id>/actividades", methods=["GET"])
@roles_permitidos("medico")
def obtener_actividades(medico_id):
    medico = Medico.obtener_por_id(medico_id)
    return jsonify([act.to_dict() for act in medico.actividades])


# Laboratorios

@api.route("/laboratorios", methods=["GET"])
@jwt_required()
def get_laboratorios():
    labs = Laboratorio.obtener_todos()
    return jsonify([l.to_dict() for l in labs])

@api.route("/laboratorios", methods=["POST"])
@roles_permitidos("medico")
def crear_laboratorio():
    data = request.json
    lab = Laboratorio.crear(nombre=data["nombre"], direccion=data.get("direccion"), especialidad=data.get("especialidad"))
    return jsonify(lab.to_dict())


# Analíticas

@api.route("/analiticas", methods=["GET"])
@jwt_required()
def get_analiticas():
    analiticas = Analitica.obtener_todas()
    return jsonify([a.to_dict() for a in analiticas])

@api.route("/analiticas", methods=["POST"])
@roles_permitidos("medico")
def crear_analitica():
    data = request.json
    a = Analitica.crear(tipo=data["tipo"], resultado=data["resultado"], fecha=data["fecha"], paciente_id=data["paciente_id"], laboratorio_id=data["laboratorio_id"])
    return jsonify(a.to_dict())

@api.route("/pacientes/<int:paciente_id>/analiticas", methods=["GET"])
@roles_permitidos("paciente", "medico")
def analiticas_por_paciente(paciente_id):
    identity = get_jwt_identity()
    if get_jwt()["tipo"] == "paciente" and int(identity) != paciente_id:
        return jsonify({"message": "Acceso denegado"}), 403
    paciente = Paciente.obtener_por_id(paciente_id)
    return jsonify([a.to_dict() for a in paciente.analiticas])


# Historial Médico

@api.route("/pacientes/<int:paciente_id>/historial", methods=["GET"])
@roles_permitidos("paciente", "medico")
def historial_por_paciente(paciente_id):
    identity = get_jwt_identity()
    if get_jwt()["tipo"] == "paciente" and int(identity) != paciente_id:
        return jsonify({"message": "Acceso denegado"}), 403
    paciente = Paciente.obtener_por_id(paciente_id)
    return jsonify([h.to_dict() for h in paciente.historial])

@api.route("/pacientes/<int:paciente_id>/historial", methods=["POST"])
@roles_permitidos("medico")
def crear_historial(paciente_id):
    data = request.json
    h = HistorialMedico.crear(descripcion=data["descripcion"], fecha=data["fecha"], paciente_id=paciente_id)
    return jsonify(h.to_dict())


# Fármacos

@api.route("/farmacos", methods=["GET"])
@jwt_required()
def get_farmacos():
    farmacos = Farmaco.obtener_todos()
    return jsonify([f.to_dict() for f in farmacos])

@api.route("/farmacos", methods=["POST"])
@roles_permitidos("medico")
def crear_farmaco():
    data = request.json
    f = Farmaco.crear(nombre=data["nombre"], descripcion=data.get("descripcion"))
    return jsonify(f.to_dict())


# Alergias
@api.route("/pacientes/<int:paciente_id>/alergias", methods=["GET"])
@roles_permitidos("paciente", "medico")
def alergias_por_paciente(paciente_id):
    identity = get_jwt_identity()
    if get_jwt()["tipo"] == "paciente" and int(identity) != paciente_id:
        return jsonify({"message": "Acceso denegado"}), 403
    paciente = Paciente.obtener_por_id(paciente_id)
    return jsonify([a.to_dict() for a in paciente.alergias])

@api.route("/pacientes/<int:paciente_id>/alergias", methods=["POST"])
@roles_permitidos("medico")
def crear_alergia(paciente_id):
    data = request.json
    a = AlergiaFarmaco.crear(paciente_id=paciente_id, farmaco_id=data["farmaco_id"], nivel_reaccion=data["nivel_reaccion"])
    return jsonify(a.to_dict())


#  FLUJO DE CITAS 


#  Listar especialidades
@api.route("/especialidades", methods=["GET"])
@jwt_required()
def listar_especialidades():
    especialidades = db.session.query(Medico.especialidad).distinct().all()
    return jsonify([e[0] for e in especialidades])

# Listar médicos por especialidad
@api.route("/medicos/especialidad", methods=["GET"])
@jwt_required()
def medicos_por_especialidad():
    especialidad = request.args.get("especialidad")
    if not especialidad:
        return jsonify({"error": "Debes enviar la especialidad"}), 400
    
    medicos = Medico.query.filter_by(especialidad=especialidad).all()
    return jsonify([m.to_dict() for m in medicos])

# Mostrar citas disponibles de un médico

@api.route("/medicos/<int:medico_id>/citas-disponibles", methods=["GET"])
@jwt_required()
def citas_disponibles(medico_id):
    hoy = datetime.now().date()
    dias_a_mostrar = 7  # próximos 7 días
    horarios = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00"]  # ejemplo de horarios

    citas_ocupadas = Cita.query.filter_by(medico_id=medico_id).filter(Cita.fecha >= hoy).all()
    citas_ocupadas_set = set(f"{c.fecha} {c.hora}" for c in citas_ocupadas)

    disponibles = []
    for i in range(dias_a_mostrar):
        dia = hoy + timedelta(days=i)
        for h in horarios:
            slot = f"{dia} {h}"
            if slot not in citas_ocupadas_set:
                disponibles.append({"fecha": str(dia), "hora": h})

    return jsonify(disponibles)


# Reservar cita (solo pacientes)
@api.route("/citas/reservar", methods=["POST"])
@roles_permitidos("paciente")
def reservar_cita_api():
    data = request.json
    paciente_id = int(get_jwt_identity())  # paciente autenticado
    medico_id = data.get("medico_id")
    fecha = data.get("fecha")
    motivo = data.get("motivo")

    if not all([medico_id, fecha, motivo]):
        return jsonify({"error": "Faltan datos para reservar la cita"}), 400

    # Verificar que la cita no esté ocupada
    cita_existente = Cita.query.filter_by(medico_id=medico_id, fecha=fecha).first()
    if cita_existente:
        return jsonify({"error": "Esta cita ya está ocupada"}), 400

    # Crear la cita
    cita = Cita.crear(fecha=fecha, motivo=motivo, paciente_id=paciente_id, medico_id=medico_id)
    return jsonify(cita.to_dict()), 201


# Reprogramar cita
@api.route("/citas/<int:cita_id>/reprogramar", methods=["PUT"])
@roles_permitidos("paciente")
def reprogramar_cita(cita_id):
    data = request.json
    nueva_fecha = data.get("fecha")
    nuevo_motivo = data.get("motivo")

    if not nueva_fecha:
        return jsonify({"error": "Se requiere la nueva fecha"}), 400

    cita = Cita.query.get(cita_id)
    if not cita:
        return jsonify({"error": "Cita no encontrada"}), 404

    paciente_id = int(get_jwt_identity())
    if cita.paciente_id != paciente_id:
        return jsonify({"error": "No puedes reprogramar esta cita"}), 403

    # Verificar que no exista otra cita en esa fecha para el mismo médico
    cita_existente = Cita.query.filter_by(medico_id=cita.medico_id, fecha=nueva_fecha).first()
    if cita_existente:
        return jsonify({"error": "Ya existe una cita en esa fecha"}), 400

    cita.fecha = nueva_fecha
    if nuevo_motivo:
        cita.motivo = nuevo_motivo

    db.session.commit()
    return jsonify(cita.to_dict()), 200

