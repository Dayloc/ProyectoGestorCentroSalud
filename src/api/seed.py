# api/seed.py
from api.models import db, Medico, Paciente, Cita
from datetime import date
import bcrypt

# Función para generar hash con bcrypt
def hash_password(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def seed_data(app):
    with app.app_context():
        # Crear tablas si no existen
        db.create_all()

        # Limpiar tablas en orden correcto
        Cita.query.delete()
        db.session.commit()
        Paciente.query.delete()
        Medico.query.delete()
        db.session.commit()

        # ======= MÉDICOS =======
        medicos = [
            Medico.crear("Dr. Juan Pérez", "Cardiología", hash_password("1234"), "juanperez@example.com"),
            Medico.crear("Dra. María López", "Pediatría", hash_password("1234"), "marialopez@example.com"),
            Medico.crear("Dr. Carlos Ruiz", "Dermatología", hash_password("1234"), "carlosruiz@example.com"),
            Medico.crear("Dra. Laura Fernández", "Neurología", hash_password("1234"), "laurafernandez@example.com"),
            Medico.crear("Dr. Pedro Gómez", "Oftalmología", hash_password("1234"), "pedrogomez@example.com")
        ]
        db.session.add_all(medicos)
        db.session.commit()

        # ======= PACIENTES =======
        pacientes = [
            Paciente(
                nombre="Carlos González",
                email="carlos@example.com",
                password=hash_password("1234"),
                fecha_nacimiento=date(1993, 1, 1)
            ),
            Paciente(
                nombre="Ana Martínez",
                email="ana@example.com",
                password=hash_password("1234"),
                fecha_nacimiento=date(1998, 5, 12)
            ),
            Paciente(
                nombre="Luis Torres",
                email="luistorres@example.com",
                password=hash_password("1234"),
                fecha_nacimiento=date(1983, 7, 23)
            ),
            Paciente(
                nombre="Marta Díaz",
                email="martadiaz@example.com",
                password=hash_password("1234"),
                fecha_nacimiento=date(1988, 3, 14)
            ),
            Paciente(
                nombre="José Ramos",
                email="joseramos@example.com",
                password=hash_password("1234"),
                fecha_nacimiento=date(1973, 11, 30)
            )
        ]
        db.session.add_all(pacientes)
        db.session.commit()

        # ======= CITAS =======
        citas = [
            Cita(medico_id=medicos[0].id, paciente_id=pacientes[0].id, fecha=date(2025, 9, 15), motivo="Consulta general"),
            Cita(medico_id=medicos[1].id, paciente_id=pacientes[1].id, fecha=date(2025, 9, 16), motivo="Chequeo pediátrico"),
            Cita(medico_id=medicos[2].id, paciente_id=pacientes[2].id, fecha=date(2025, 9, 17), motivo="Revisión dermatológica"),
            Cita(medico_id=medicos[3].id, paciente_id=pacientes[3].id, fecha=date(2025, 9, 18), motivo="Consulta neurológica"),
            Cita(medico_id=medicos[4].id, paciente_id=pacientes[4].id, fecha=date(2025, 9, 19), motivo="Chequeo oftalmológico")
        ]
        db.session.add_all(citas)
        db.session.commit()

        print("✅ Datos de prueba creados correctamente")
