
import React,{useEffect} from 'react'
import { getMedico } from '../services/fetchs'
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Doctorimg from "../assets/img/Doctor.png";

function ComponenteProtegidoMedico() {
    const { store, dispatch } = useGlobalReducer();
     const {datosMedico} = store

     
useEffect(() => {
  getMedico(dispatch)
}, []);


    
  return (
    <div className="container my-4">
      <div className="bg-primary bg-opacity-25 rounded-4 p-4">
        <div className="row g-4">
          <section className="col-lg-8">

            {/*Buscador*/}

            <div className="position-relative mb-4">
              <i className="bi bi-search position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
              <input
              type="search"
              className="form-control form-control-lg ps-5 rounded-pill"
              placeholder="Buscador"
              />
            </div>

            {/*Botones Navegación*/}

            <div className="d-grid gap-3">
              <button className="btn btn-primary btn-lg rounded-pill">
                Próximas Citas
              </button>
              <button className="btn btn-primary btn-lg rounded-pill">
                Citas Libres
              </button>
              <button className="btn btn-primary btn-lg rounded-pill">
                Agenda de Actividades
              </button>
              <button className="btn btn-primary btn-lg rounded-pill">
                Pacientes
              </button>
            </div>
          </section>

          {/* Columna Derecha Datos Médico */}
          
          <aside className="col-lg-4 text-center">
            <img
              src={Doctorimg}
              alt="Foto del médico"
              className="img-fluid mb-3 rounded-circle shadow-sm"
              style={{ maxHeight: "180px" }}
            />
            <h5 className="fw-bold">
              Bienvenido {datosMedico ? datosMedico.nombre : "Cargando datos..."}
            </h5>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ComponenteProtegidoMedico