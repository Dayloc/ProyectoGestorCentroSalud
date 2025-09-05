from flask import Blueprint, request, jsonify
from api.models import db, Paciente, Medico, Laboratorio, Analitica, HistorialMedico, Farmaco, AlergiaFarmaco

api = Blueprint('api', __name__)

# ===================== Hello Endpoint =====================
@api.route('/hello', methods=['GET', 'POST'])
def handle_hello():
    response_body = {
        "message": "Hello! This message comes from the backend."
    }
    return jsonify(response_body), 200


# 🤒 Pacientes🤒
@api.route("/pacientes", methods=["GET"])
def get_pacientes():
    pacientes = Paciente.obtener_todos()
    return jsonify([{
        "id": p.id,
        "nombre": p.nombre,
        "email": p.email,
        "fecha_nacimiento": str(p.fecha_nacimiento)
    } for p in pacientes])


@api.route("/pacientes", methods=["POST"])
def crear_paciente():
    data = request.json
    paciente = Paciente.crear(
        nombre=data["nombre"],
        email=data["email"],
        fecha_nacimiento=data["fecha_nacimiento"]
    )
    return jsonify({"id": paciente.id, "nombre": paciente.nombre})


@api.route("/pacientes/<int:paciente_id>", methods=["GET"])
def paciente_por_id(paciente_id):
    p = Paciente.obtener_por_id(paciente_id)
    if not p:
        return jsonify({"error": "Paciente no encontrado"}), 404
    return jsonify({
        "id": p.id,
        "nombre": p.nombre,
        "email": p.email,
        "fecha_nacimiento": str(p.fecha_nacimiento)
    })


# 😷 Médicos 😷
@api.route("/medicos", methods=["GET"])
def get_medicos():
    medicos = Medico.obtener_todos()
    return jsonify([{"id": m.id, "nombre": m.nombre, "especialidad": m.especialidad} for m in medicos])


@api.route("/medicos", methods=["POST"])
def crear_medico():
    data = request.json
    medico = Medico.crear(nombre=data["nombre"], especialidad=data["especialidad"])
    return jsonify({"id": medico.id, "nombre": medico.nombre})


# 🔬 Laboratorios🔬
@api.route("/laboratorios", methods=["GET"])
def get_laboratorios():
    labs = Laboratorio.obtener_todos()
    return jsonify([{"id": l.id, "nombre": l.nombre, "direccion": l.direccion} for l in labs])


@api.route("/laboratorios", methods=["POST"])
def crear_laboratorio():
    data = request.json
    lab = Laboratorio.crear(
        nombre=data["nombre"],
        direccion=data.get("direccion"),
        especialidad=data.get("especialidad")
    )
    return jsonify({"id": lab.id, "nombre": lab.nombre})


# 🧾 Analíticas 🧾
@api.route("/analiticas", methods=["GET"])
def get_analiticas():
    analiticas = Analitica.obtener_todas()
    return jsonify([{
        "id": a.id,
        "tipo": a.tipo,
        "resultado": a.resultado,
        "fecha": str(a.fecha),
        "paciente_id": a.paciente_id,
        "laboratorio_id": a.laboratorio_id
    } for a in analiticas])


@api.route("/analiticas", methods=["POST"])
def crear_analitica():
    data = request.json
    a = Analitica.crear(
        tipo=data["tipo"],
        resultado=data["resultado"],
        fecha=data["fecha"],
        paciente_id=data["paciente_id"],
        laboratorio_id=data["laboratorio_id"]
    )
    return jsonify({"id": a.id, "tipo": a.tipo})


@api.route("/pacientes/<int:paciente_id>/analiticas", methods=["GET"])
def analiticas_por_paciente(paciente_id):
    analiticas = Analitica.obtener_por_paciente(paciente_id)
    return jsonify([{
        "id": a.id,
        "tipo": a.tipo,
        "resultado": a.resultado,
        "fecha": str(a.fecha),
        "laboratorio_id": a.laboratorio_id
    } for a in analiticas])


# 🏥 Historial Médico 🏥
@api.route("/pacientes/<int:paciente_id>/historial", methods=["GET"])
def historial_por_paciente(paciente_id):
    historial = HistorialMedico.obtener_por_paciente(paciente_id)
    return jsonify([{
        "id": h.id,
        "descripcion": h.descripcion,
        "fecha": str(h.fecha)
    } for h in historial])


@api.route("/pacientes/<int:paciente_id>/historial", methods=["POST"])
def crear_historial(paciente_id):
    data = request.json
    h = HistorialMedico.crear(
        descripcion=data["descripcion"],
        fecha=data["fecha"],
        paciente_id=paciente_id
    )
    return jsonify({"id": h.id, "descripcion": h.descripcion})


# 💊 Fármacos 💊
@api.route("/farmacos", methods=["GET"])
def get_farmacos():
    farmacos = Farmaco.obtener_todos()
    return jsonify([{"id": f.id, "nombre": f.nombre, "descripcion": f.descripcion} for f in farmacos])


@api.route("/farmacos", methods=["POST"])
def crear_farmaco():
    data = request.json
    f = Farmaco.crear(nombre=data["nombre"], descripcion=data.get("descripcion"))
    return jsonify({"id": f.id, "nombre": f.nombre})


# 🤮 Alergias 🤮
@api.route("/pacientes/<int:paciente_id>/alergias", methods=["GET"])
def alergias_por_paciente(paciente_id):
    alergias = AlergiaFarmaco.obtener_por_paciente(paciente_id)
    return jsonify([{
        "id": a.id,
        "farmaco_id": a.farmaco_id,
        "nivel_reaccion": a.nivel_reaccion
    } for a in alergias])


@api.route("/pacientes/<int:paciente_id>/alergias", methods=["POST"])
def crear_alergia(paciente_id):
    data = request.json
    a = AlergiaFarmaco.crear(
        paciente_id=paciente_id,
        farmaco_id=data["farmaco_id"],
        nivel_reaccion=data["nivel_reaccion"]
    )
    return jsonify({"id": a.id, "farmaco_id": a.farmaco_id})
