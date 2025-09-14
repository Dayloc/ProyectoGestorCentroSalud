import React, { useEffect, useState } from "react";
import { getPaciente } from "../services/fetchs";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import PacienteImg from "../assets/img/Paciente.png";

function ComponenteProtegidoPaciente() {
  const { store, dispatch } = useGlobalReducer();
  const { datosPaciente } = store;

  const [citas, setCitas] = useState([]); // Puedes cargar citas desde getPaciente
  const [openSections, setOpenSections] = useState({
    reprogramarCita: false,
    tomarCita: false,
    resultados: false,
    citasPendientes: false,
    historialMedico: false,
    farmacos: false,
  });

  useEffect(() => {
    getPaciente(dispatch)
      .then((data) => {
        if (data?.citas) setCitas(data.citas);
      })
      .catch((err) => console.error(err));
  }, [dispatch]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
console.log(datosPaciente);

  return (
    <div className="container my-4">
      <div className="bg-primary bg-opacity-25 rounded-4 p-4">
        <div className="row g-4">
          <section className="col-lg-8">
            {/* Botones de navegación */}
            <div className="d-grid gap-3 mb-4">

              {/* Reprogramar Cita */}
              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("reprogramarCita")}
                >
                  Reprogramar cita
                </button>
                {openSections.reprogramarCita && (
                  <div className="bg-light p-3 rounded mt-2">
                    <p>Aquí se puede reprogramar citas.</p>
                  </div>
                )}
              </div>

              {/* Tomar una Cita */}
              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("tomarCita")}
                >
                  Tomar una cita
                </button>
                {openSections.tomarCita && (
                  <div className="bg-light p-3 rounded mt-2">
                    <p>Selecciona una cita disponible para tomar.</p>
                  </div>
                )}
              </div>

              {/* Resultados de Analítica */}
              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("resultados")}
                >
                  Resultados de Analítica
                </button>
                {openSections.resultados && (
                  <div className="bg-light p-3 rounded mt-2">
                    <p>Aquí se mostrarán los resultados de las analíticas.</p>
                  </div>
                )}
              </div>

              {/* Citas Pendientes */}
              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("citasPendientes")}
                >
                  Citas Pendientes
                </button>
                {openSections.citasPendientes && (
                  <div className="bg-light p-3 rounded mt-2">
                    {citas.length > 0 ? (
                      <ul className="list-group">
                        {citas.map((cita, index) => (
                          <li key={index} className="list-group-item">
                            <strong>Médico:</strong> {cita.medico.nombre} <br />
                            <strong>Fecha:</strong> {cita.fecha} <br />
                            <strong>Motivo:</strong> {cita.motivo}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No tiene citas pendientes.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Historial Médico */}
              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("historialMedico")}
                >
                  Historial Médico
                </button>
                {openSections.historialMedico && (
                  <div className="bg-light p-3 rounded mt-2">
                    <p>Aquí se mostrará el historial médico completo.</p>
                  </div>
                )}
              </div>

              {/* Fármacos alérgicos */}
              <div>
                <button
                  className="btn btn-primary btn-lg rounded-pill w-100"
                  onClick={() => toggleSection("farmacos")}
                >
                  Fármacos alérgicos
                </button>
                {openSections.farmacos && (
                  <div className="bg-light p-3 rounded mt-2">
                    <p>No hay farmacos aún</p>
                  </div>
                )}
              </div>

            </div>
          </section>

          {/* Columna derecha datos Paciente */}
          <aside className="col-lg-4 text-center">
            <img
              src={PacienteImg}
              alt="Foto del paciente"
              className="img-fluid mb-3 rounded-circle shadow-sm"
              style={{ maxHeight: "180px" }}
            />
            <h5 className="fw-bold">
              Bienvenido/a {datosPaciente ? datosPaciente.nombre : "Cargando datos..."}
            </h5>
            <button className="btn btn-success rounded-pill mt-2">Editar Perfil</button>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ComponenteProtegidoPaciente;
