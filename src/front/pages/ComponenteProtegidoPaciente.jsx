
import React,{useEffect} from 'react'
import { getPaciente } from '../services/fetchs'
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import PacienteImg from "../assets/img/Paciente.png";

function ComponenteProtegidoPaciente() {
  const { store, dispatch } = useGlobalReducer();
  const {datosPaciente} = store

useEffect(() => {
  getPaciente(dispatch)
}, []);


    
  return (
    <div className="container my-4">
      <div className="bg-primary bg-opacity-25 rounded-4 p-4">
        <div className="row g-4">
          <section className="col-lg-8">
            
            {/* Buscador */}

            <div className="position-relative mb-4">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
              <input
                type="search"
                className="form-control form-control-lg ps-5 rounded-pill"
                placeholder="Buscador"
              />
            </div>

            {/* Botones de navegación */}

            <div className="d-grid gap-3">
              <button className="btn btn-primary btn-lg rounded-pill">
                Reprogramar cita
              </button>
              <button className="btn btn-primary btn-lg rounded-pill">
                Tomar una cita
              </button>
              <button className="btn btn-primary btn-lg rounded-pill">
                Resultados de Analítica
              </button>
              <button className="btn btn-primary btn-lg rounded-pill">
                Citas Pendientes
              </button>
              <button className="btn btn-primary btn-lg rounded-pill">
                Historial Médico
              </button>
              <button className="btn btn-primary btn-lg rounded-pill">
                Fármacos alérgicos
              </button>
            </div>
          </section>

          {/* Columna derecha datos Paciente*/}

          <aside className="col-lg-4 text-center">
            <img
              src={PacienteImg}
              alt="Foto del paciente"
              className="img-fluid mb-3 rounded-circle shadow-sm"
              style={{ maxHeight: "180px" }}
            />
            <h5 className="fw-bold">
              Bienvenido {datosPaciente ? datosPaciente.nombre : "Cargando datos..."}
            </h5>
            <button className="btn btn-success rounded-pill mt-2">
              Editar Perfil
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ComponenteProtegidoPaciente
