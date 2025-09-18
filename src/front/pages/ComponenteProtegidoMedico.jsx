import React, { useEffect, useState } from "react";
import { getMedico } from "../services/fetchs";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import Doctorimg from "../assets/img/Doctor.png";
import { useNavigate } from "react-router-dom";

function ComponenteProtegidoMedico() {
  const { store, dispatch } = useGlobalReducer();
  const { datosMedico } = store;


  const navigate = useNavigate()


  const [citas, setCitas] = useState([]);
  const [openSections, setOpenSections] = useState({
    proximasCitas: false,
    citasLibres: false,
    agenda: false,
    pacientes: false
  });

  useEffect(() => {
    getMedico(dispatch)
      .then((data) => {
        if (data?.citas) setCitas(data.citas);
      })
      .catch((err) => console.error(err));
  }, [dispatch]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section] // alterna abierto/cerrado
    }));
  };

  return (
    <div className="container my-4">
      <div className="bg-primary bg-opacity-25 rounded-4 p-4">
        <div className="row g-4">
          <section className="col-lg-8">
            {/* Botones Navegación */}
            <div className="d-grid gap-3 mb-4">
              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("proximasCitas")}
                >
                  Próximas Citas
                </button>
                {openSections.proximasCitas && (
                  <div className="bg-light p-3 rounded mt-2">
                    {citas.length > 0 ? (
                      <ul className="list-group">
                        {citas.map((cita, index) => (
                          <li key={index} className="list-group-item">
                            <strong>Paciente:</strong> {cita.paciente.nombre} <br />
                            <strong>Fecha:</strong> {cita.fecha} <br />
                            <strong>Motivo:</strong> {cita.motivo}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No tiene citas programadas.</p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("citasLibres")}
                >
                  Citas Libres
                </button>
                {openSections.citasLibres && (
                  <div className="bg-light p-3 rounded mt-2">
                    <p>Aquí se mostrará las citas libres...</p>
                  </div>
                )}
              </div>

              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => navigate(`/actividadesMedico/${datosMedico.id}`)}
                >
                  Agenda de Actividades
                </button>
                {openSections.agenda && (
                  <div className="bg-light p-3 rounded mt-2">
                    <p>Contenido de agenda de actividades...</p>
                  </div>
                )}
              </div>

              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("pacientes")}
                >
                  Pacientes
                </button>
                {openSections.pacientes && (
                  <div className="bg-light p-3 rounded mt-2">
                    <p>Lista de pacientes...</p>
                  </div>
                )}
              </div>
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
  );
}

export default ComponenteProtegidoMedico;
