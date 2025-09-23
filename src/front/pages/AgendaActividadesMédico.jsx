import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrarActividad } from './../services/fetchs';

function AgendaActividadesMedico() {
  const [actividad, setActividad] = useState({
    titulo: '',
    descripcion: '',
    horaInicio: '',
    horaFin: '',
    dia: ''
  });

  const { id } = useParams(); // id del médico
  const navigate = useNavigate(); // hook para redirigir

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActividad({ ...actividad, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrarActividad(actividad, id);
      alert('Actividad registrada con éxito ✅');
      setActividad({ titulo: '', descripcion: '', horaInicio: '', horaFin: '', dia: '' });
      
      // Redirigir a ComponenteProtegidoMédico
      navigate('/dashboardMedico');
    } catch (error) {
      console.error(error);
      alert('Error al registrar la actividad ❌');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3 className="card-title mb-4 text-center">Registrar Actividad</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="titulo"
            placeholder="Título"
            value={actividad.titulo}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />
          <input
            type="text"
            name="descripcion"
            placeholder="Descripción"
            value={actividad.descripcion}
            onChange={handleChange}
            className="form-control mb-3"
          />
          <input
            type="date"
            name="dia"
            value={actividad.dia}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />
          <input
            type="time"
            name="horaInicio"
            value={actividad.horaInicio}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />
          <input
            type="time"
            name="horaFin"
            value={actividad.horaFin}
            onChange={handleChange}
            className="form-control mb-3"
            required
          />
          <button type="submit" className="btn btn-primary w-100">Registrar</button>
        </form>
      </div>
    </div>
  );
}

export default AgendaActividadesMedico;
