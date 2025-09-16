from models import db, Paciente, Medico, Cita
from datetime import datetime

# ==================== 1. Obtener especialidades ====================
def obtener_especialidades():
    # Tomamos todas las especialidades únicas de los médicos
    especialidades = db.session.query(Medico.especialidad).distinct().all()
    # Devuelve lista de strings
    return [e[0] for e in especialidades]


# ==================== 2. Obtener médicos por especialidad ====================
def obtener_medicos_por_especialidad(especialidad):
    return Medico.query.filter_by(especialidad=especialidad).all()


# ==================== 3. Obtener citas disponibles por médico ====================
def obtener_citas_disponibles(medico_id):
    hoy = datetime.now().date()
    # Solo citas futuras
    return Cita.query.filter_by(medico_id=medico_id).filter(Cita.fecha >= hoy).all()


# ==================== 4. Reservar cita ====================
def reservar_cita(paciente_id, medico_id, fecha, motivo):
    # Verificamos que la cita no exista ya
    cita_existente = Cita.query.filter_by(medico_id=medico_id, fecha=fecha).first()
    if cita_existente:
        return {"error": "Esta cita ya está ocupada"}
    
    cita = Cita.crear(fecha=fecha, motivo=motivo, paciente_id=paciente_id, medico_id=medico_id)
    return cita.to_dict()


# ==================== Ejemplo de flujo completo ====================
def flujo_reserva(paciente_id, especialidad, medico_id, fecha, motivo):
    # Paso 1: Obtener médicos
    medicos = obtener_medicos_por_especialidad(especialidad)
    if not any(m.id == medico_id for m in medicos):
        return {"error": "Médico no pertenece a esa especialidad"}

    # Paso 2: Verificar citas disponibles
    citas = obtener_citas_disponibles(medico_id)
    if any(c.fecha == fecha for c in citas):
        return {"error": "La fecha ya está ocupada"}

    # Paso 3: Reservar
    return reservar_cita(paciente_id, medico_id, fecha, motivo)
