from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Date, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

db = SQLAlchemy()

# =====================
# Usuario general
# =====================


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean(), default=True, nullable=False)

    # ===== CRUD =====
    @staticmethod
    def crear(email, password, is_active=True):
        user = User(email=email, password=password, is_active=is_active)
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def obtener_todos():
        return User.query.all()

    @staticmethod
    def obtener_por_id(user_id):
        return User.query.get(user_id)

    # ===== Serialización segura =====
    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email
        }


# =====================
# Pacientes
# =====================
class Paciente(db.Model):
    __tablename__ = "pacientes"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    fecha_nacimiento: Mapped[datetime.date] = mapped_column(nullable=False)

    citas: Mapped[list["Cita"]] = relationship(
        "Cita", back_populates="paciente", primaryjoin="Paciente.id==Cita.paciente_id"
    )
    historial: Mapped[list["HistorialMedico"]] = relationship(
        "HistorialMedico", back_populates="paciente", primaryjoin="Paciente.id==HistorialMedico.paciente_id"
    )
    alergias: Mapped[list["AlergiaFarmaco"]] = relationship(
        "AlergiaFarmaco", back_populates="paciente", primaryjoin="Paciente.id==AlergiaFarmaco.paciente_id"
    )
    analiticas: Mapped[list["Analitica"]] = relationship(
        "Analitica", back_populates="paciente", primaryjoin="Paciente.id==Analitica.paciente_id"
    )

    @staticmethod
    def crear(nombre, email, fecha_nacimiento):
        paciente = Paciente(nombre=nombre, email=email,
                            fecha_nacimiento=fecha_nacimiento)
        db.session.add(paciente)
        db.session.commit()
        return paciente

    @staticmethod
    def obtener_todos():
        return Paciente.query.all()

    @staticmethod
    def obtener_por_id(paciente_id):
        return Paciente.query.get(paciente_id)

    def actualizar(self, nombre=None, email=None, fecha_nacimiento=None):
        if nombre:
            self.nombre = nombre
        if email:
            self.email = email
        if fecha_nacimiento:
            self.fecha_nacimiento = fecha_nacimiento
        db.session.commit()
        return self

    def eliminar(self):
        db.session.delete(self)
        db.session.commit()

    def to_dict(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "email": self.email,
            "fecha_nacimiento": str(self.fecha_nacimiento)
        }


# =====================
# Médicos
# =====================
class Medico(db.Model):
    __tablename__ = "medicos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    especialidad: Mapped[str] = mapped_column(String(120), nullable=False)

    citas: Mapped[list["Cita"]] = relationship(
        "Cita", back_populates="medico", primaryjoin="Medico.id==Cita.medico_id"
    )

    @staticmethod
    def crear(nombre, especialidad):
        medico = Medico(nombre=nombre, especialidad=especialidad)
        db.session.add(medico)
        db.session.commit()
        return medico

    @staticmethod
    def obtener_todos():
        return Medico.query.all()

    def to_dict(self):
        return {"id": self.id, "nombre": self.nombre, "especialidad": self.especialidad}


# =====================
# Citas
# =====================
class Cita(db.Model):
    __tablename__ = "citas"

    id: Mapped[int] = mapped_column(primary_key=True)
    fecha: Mapped[datetime.date] = mapped_column(nullable=False)
    motivo: Mapped[str] = mapped_column(Text, nullable=False)

    paciente_id: Mapped[int] = mapped_column(
        ForeignKey("pacientes.id"), nullable=False)
    medico_id: Mapped[int] = mapped_column(
        ForeignKey("medicos.id"), nullable=False)

    paciente: Mapped["Paciente"] = relationship(
        "Paciente", back_populates="citas")
    medico: Mapped["Medico"] = relationship("Medico", back_populates="citas")

    @staticmethod
    def crear(fecha, motivo, paciente_id, medico_id):
        cita = Cita(fecha=fecha, motivo=motivo,
                    paciente_id=paciente_id, medico_id=medico_id)
        db.session.add(cita)
        db.session.commit()
        return cita

    @staticmethod
    def obtener_todas():
        return Cita.query.all()

    def to_dict(self):
        return {
            "id": self.id,
            "fecha": str(self.fecha),
            "motivo": self.motivo,
            "paciente_id": self.paciente_id,
            "medico_id": self.medico_id
        }


# =====================
# Historial Médico
# =====================
class HistorialMedico(db.Model):
    __tablename__ = "historiales"

    id: Mapped[int] = mapped_column(primary_key=True)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[datetime.date] = mapped_column(nullable=False)

    paciente_id: Mapped[int] = mapped_column(
        ForeignKey("pacientes.id"), nullable=False)
    paciente: Mapped["Paciente"] = relationship(
        "Paciente", back_populates="historial")

    @staticmethod
    def crear(descripcion, fecha, paciente_id):
        historial = HistorialMedico(
            descripcion=descripcion, fecha=fecha, paciente_id=paciente_id)
        db.session.add(historial)
        db.session.commit()
        return historial

    @staticmethod
    def obtener_por_paciente(paciente_id):
        return HistorialMedico.query.filter_by(paciente_id=paciente_id).all()

    def to_dict(self):
        return {"id": self.id, "descripcion": self.descripcion, "fecha": str(self.fecha)}


# =====================
# Laboratorios
# =====================
class Laboratorio(db.Model):
    __tablename__ = "laboratorios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    direccion: Mapped[str] = mapped_column(String(200), nullable=True)
    especialidad: Mapped[str] = mapped_column(String(120), nullable=True)

    analiticas: Mapped[list["Analitica"]] = relationship(
        "Analitica", back_populates="laboratorio", primaryjoin="Laboratorio.id==Analitica.laboratorio_id"
    )

    @staticmethod
    def crear(nombre, direccion=None, especialidad=None):
        lab = Laboratorio(nombre=nombre, direccion=direccion,
                          especialidad=especialidad)
        db.session.add(lab)
        db.session.commit()
        return lab

    @staticmethod
    def obtener_todos():
        return Laboratorio.query.all()

    def to_dict(self):
        return {"id": self.id, "nombre": self.nombre, "direccion": self.direccion, "especialidad": self.especialidad}


# =====================
# Analíticas
# =====================
class Analitica(db.Model):
    __tablename__ = "analiticas"

    id: Mapped[int] = mapped_column(primary_key=True)
    tipo: Mapped[str] = mapped_column(String(120), nullable=False)
    resultado: Mapped[str] = mapped_column(Text, nullable=False)
    fecha: Mapped[datetime.date] = mapped_column(nullable=False)

    paciente_id: Mapped[int] = mapped_column(
        ForeignKey("pacientes.id"), nullable=False)
    laboratorio_id: Mapped[int] = mapped_column(
        ForeignKey("laboratorios.id"), nullable=False)

    paciente: Mapped["Paciente"] = relationship(
        "Paciente", back_populates="analiticas")
    laboratorio: Mapped["Laboratorio"] = relationship(
        "Laboratorio", back_populates="analiticas")

    @staticmethod
    def crear(tipo, resultado, fecha, paciente_id, laboratorio_id):
        analitica = Analitica(tipo=tipo, resultado=resultado, fecha=fecha,
                              paciente_id=paciente_id, laboratorio_id=laboratorio_id)
        db.session.add(analitica)
        db.session.commit()
        return analitica

    @staticmethod
    def obtener_por_paciente(paciente_id):
        return Analitica.query.filter_by(paciente_id=paciente_id).all()

    @staticmethod
    def obtener_todas():
        return Analitica.query.all()

    def to_dict(self):
        return {
            "id": self.id,
            "tipo": self.tipo,
            "resultado": self.resultado,
            "fecha": str(self.fecha),
            "paciente_id": self.paciente_id,
            "laboratorio_id": self.laboratorio_id
        }


# =====================
# Fármacos
# =====================
class Farmaco(db.Model):
    __tablename__ = "farmacos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=True)

    alergias: Mapped[list["AlergiaFarmaco"]] = relationship(
        "AlergiaFarmaco", back_populates="farmaco", primaryjoin="Farmaco.id==AlergiaFarmaco.farmaco_id"
    )

    @staticmethod
    def crear(nombre, descripcion=None):
        f = Farmaco(nombre=nombre, descripcion=descripcion)
        db.session.add(f)
        db.session.commit()
        return f

    @staticmethod
    def obtener_todos():
        return Farmaco.query.all()

    def to_dict(self):
        return {"id": self.id, "nombre": self.nombre, "descripcion": self.descripcion}


# =====================
# Alergias
# =====================
class AlergiaFarmaco(db.Model):
    __tablename__ = "alergias_farmacos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nivel_reaccion: Mapped[str] = mapped_column(String(50), nullable=False)

    paciente_id: Mapped[int] = mapped_column(
        ForeignKey("pacientes.id"), nullable=False)
    farmaco_id: Mapped[int] = mapped_column(
        ForeignKey("farmacos.id"), nullable=False)

    paciente: Mapped["Paciente"] = relationship(
        "Paciente", back_populates="alergias")
    farmaco: Mapped["Farmaco"] = relationship(
        "Farmaco", back_populates="alergias")

    @staticmethod
    def crear(paciente_id, farmaco_id, nivel_reaccion):
        a = AlergiaFarmaco(paciente_id=paciente_id,
                           farmaco_id=farmaco_id, nivel_reaccion=nivel_reaccion)
        db.session.add(a)
        db.session.commit()
        return a

    @staticmethod
    def obtener_por_paciente(paciente_id):
        return AlergiaFarmaco.query.filter_by(paciente_id=paciente_id).all()

    def to_dict(self):
        return {"id": self.id, "nivel_reaccion": self.nivel_reaccion, "paciente_id": self.paciente_id, "farmaco_id": self.farmaco_id}
