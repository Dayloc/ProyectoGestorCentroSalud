# api/seed.py
from api.models import db, Medico, Paciente, Cita
from werkzeug.security import generate_password_hash
from datetime import date

def seed_data(app):
    with app.app_context():
        db.create_all()

        # Limpiar tablas primero
        Cita.query.delete()
        Paciente.query.delete()
        Medico.query.delete()
        db.session.commit()

        # Médicos
        medicos = [
            Medico.crear("Dr. Juan Pérez", "Cardiología", generate_password_hash("1234"), "juanperez@example.com"),
            Medico.crear("Dra. María López", "Pediatría", generate_password_hash("1234"), "marialopez@example.com"),
            Medico.crear("Dr. Carlos Ruiz", "Dermatología", generate_password_hash("1234"), "carlosruiz@example.com"),
            Medico.crear("Dra. Laura Fernández", "Neurología", generate_password_hash("1234"), "laurafernandez@example.com"),
            Medico.crear("Dr. Pedro Gómez", "Oftalmología", generate_password_hash("1234"), "pedrogomez@example.com")
        ]

        # Pacientes
        pacientes = [
            Paciente(nombre="Carlos González", email="carlos@example.com", password="1234", fecha_nacimiento=date(1993, 1, 1)),
            Paciente(nombre="Ana Martínez", email="ana@example.com", password="1234", fecha_nacimiento=date(1998, 5, 12)),
            Paciente(nombre="Luis Torres", email="luistorres@example.com", password="1234", fecha_nacimiento=date(1983, 7, 23)),
            Paciente(nombre="Marta Díaz", email="martadiaz@example.com", password="1234", fecha_nacimiento=date(1988, 3, 14)),
            Paciente(nombre="José Ramos", email="joseramos@example.com", password="1234", fecha_nacimiento=date(1973, 11, 30))
        ]
        db.session.add_all(pacientes)
        db.session.commit()

        # Citas
        citas = [
            Cita(medico_id=medicos[0].id, paciente_id=pacientes[0].id, fecha=date(2025, 9, 15)),
            Cita(medico_id=medicos[1].id, paciente_id=pacientes[1].id, fecha=date(2025, 9, 16)),
            Cita(medico_id=medicos[2].id, paciente_id=pacientes[2].id, fecha=date(2025, 9, 17)),
            Cita(medico_id=medicos[3].id, paciente_id=pacientes[3].id, fecha=date(2025, 9, 18)),
            Cita(medico_id=medicos[4].id, paciente_id=pacientes[4].id, fecha=date(2025, 9, 19))
        ]
        db.session.add_all(citas)
        db.session.commit()

        print("✅ Datos de prueba creados correctamente")
