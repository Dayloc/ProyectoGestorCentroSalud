  
import os
from flask_admin import Admin
from .models import db, User, Paciente, Medico, Laboratorio, Analitica, HistorialMedico, Farmaco, AlergiaFarmaco
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Gestor Centro Salud', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Paciente, db.session))
    admin.add_view(ModelView(Medico, db.session))
    admin.add_view(ModelView(Laboratorio, db.session))
    admin.add_view(ModelView(Analitica, db.session))
    admin.add_view(ModelView(HistorialMedico, db.session))
    admin.add_view(ModelView(Farmaco, db.session))
    admin.add_view(ModelView(AlergiaFarmaco, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))