import React, { useEffect, useState } from "react";
import {
  getPaciente,
  getEspecialidades,
  getMedicosLista,
  getCitasDisponibles,
  tomarCita
} from "../services/fetchs";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import PacienteImg from "../assets/img/Paciente.png";

const urlBase = import.meta.env.VITE_BACKEND_URL;

function ComponenteProtegidoPaciente() {
  const { store, dispatch } = useGlobalReducer();
  const { datosPaciente, especialidades, medicos } = store;

  const [citas, setCitas] = useState([]);
  const [openSections, setOpenSections] = useState({
    reprogramarCita: false,
    tomarCita: false,
    resultados: false,
    citasPendientes: false,
    historialMedico: false,
    farmacos: false,
  });

  // Tomar cita
  const [selectedEspecialidad, setSelectedEspecialidad] = useState("");
  const [filteredMedicos, setFilteredMedicos] = useState([]);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [selectedFecha, setSelectedFecha] = useState("");
  const [motivo, setMotivo] = useState("");

  // Reprogramar cita
  const [selectedCita, setSelectedCita] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");

  useEffect(() => {
    getPaciente(dispatch)
      .then((data) => {
        if (data?.citas) setCitas(data.citas);
      })
      .catch((err) => console.error(err));

    getEspecialidades(dispatch);
    getMedicosLista(dispatch);
  }, [dispatch]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Filtrar médicos por especialidad
  useEffect(() => {
    if (selectedEspecialidad && medicos) {
      setFilteredMedicos(
        medicos.filter((m) => m.especialidad === selectedEspecialidad)
      );
    } else {
      setFilteredMedicos([]);
    }
    setSelectedMedico(null);
    setFechasDisponibles([]);
    setSelectedFecha("");
  }, [selectedEspecialidad, medicos]);

  // Cargar fechas disponibles del médico seleccionado
  useEffect(() => {
    if (selectedMedico) {
      getCitasDisponibles(selectedMedico.id)
        .then((data) => setFechasDisponibles(data))
        .catch((err) => console.error(err));
    } else {
      setFechasDisponibles([]);
      setSelectedFecha("");
    }
  }, [selectedMedico]);

  const handleReservarCita = async () => {
    if (!selectedMedico || !selectedFecha || !motivo) {
      alert("Selecciona médico, fecha y escribe un motivo");
      return;
    }
    try {
      const nuevaCita = await tomarCita({
        medico_id: selectedMedico.id,
        fecha: selectedFecha,
        motivo,
      });
      alert("Cita reservada con éxito");
      setCitas((prev) => [...prev, nuevaCita]);
      setSelectedEspecialidad("");
      setSelectedMedico(null);
      setSelectedFecha("");
      setMotivo("");
    } catch (error) {
      console.error(error);
      alert("Error al reservar la cita");
    }
  };

  const handleReprogramarCita = async () => {
  if (!selectedCita || !nuevaFecha) {
    alert("Selecciona una cita y la nueva fecha");
    return;
  }
  try {
    const token = localStorage.getItem("token"); // Obtener el token

    const response = await fetch(`${urlBase}/api/citas/${selectedCita.id}/reprogramar`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // <-- Token aquí
      },
      body: JSON.stringify({ fecha: nuevaFecha }),
    });

    if (!response.ok) throw new Error("Error al reprogramar la cita");

    const updatedCita = await response.json();
    alert("Cita reprogramada con éxito");

    setCitas((prev) =>
      prev.map((c) => (c.id === updatedCita.id ? updatedCita : c))
    );

    setSelectedCita(null);
    setNuevaFecha("");
  } catch (error) {
    console.error(error);
    alert("Error al reprogramar la cita");
  }
};


  return (
    <div className="container my-4">
      <div className="bg-light bg-opacity-25 rounded-4 p-4">
        <div className="row g-4">
          <section className="col-lg-8">
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
                    <div className="mb-2">
                      <label>Selecciona la cita:</label>
                      <select
                        className="form-select"
                        value={selectedCita?.id || ""}
                        onChange={(e) =>
                          setSelectedCita(citas.find(c => c.id === parseInt(e.target.value)))
                        }
                      >
                        <option value="">Selecciona...</option>
                        {citas.map(cita => (
                          <option key={cita.id} value={cita.id}>
                            {cita.medico.nombre} - {cita.fecha} - {cita.motivo}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label>Nueva fecha:</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={nuevaFecha}
                        onChange={(e) => setNuevaFecha(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-success mt-2"
                      onClick={handleReprogramarCita}
                    >
                      Reprogramar cita
                    </button>
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
                    <div className="mb-2">
                      <label>Especialidad:</label>
                      <select
                        className="form-select"
                        value={selectedEspecialidad}
                        onChange={(e) => setSelectedEspecialidad(e.target.value)}
                      >
                        <option value="">Selecciona...</option>
                        {especialidades?.map((esp, i) => (
                          <option key={i} value={esp}>{esp}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label>Médico:</label>
                      <select
                        className="form-select"
                        value={selectedMedico?.id || ""}
                        onChange={(e) =>
                          setSelectedMedico(
                            filteredMedicos.find((m) => m.id === parseInt(e.target.value))
                          )
                        }
                      >
                        <option value="">Selecciona...</option>
                        {filteredMedicos.map((m) => (
                          <option key={m.id} value={m.id}>{m.nombre}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label>Fecha disponible:</label>
                      <select
                        className="form-select"
                        value={selectedFecha}
                        onChange={(e) => setSelectedFecha(e.target.value)}
                      >
                        <option value="">Selecciona...</option>
                        {fechasDisponibles.map((f, i) => (
                          <option key={i} value={f.fecha}>
                            {f.fecha} {f.hora}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <label>Motivo:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn btn-success mt-2"
                      onClick={handleReservarCita}
                    >
                      Reservar cita
                    </button>
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

              {/* Historial */}
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
                    <p>No hay fármacos aún</p>
                  </div>
                )}
              </div>

            </div>
          </section>

          <aside className="col-lg-4 text-center">
            <img
              src={PacienteImg}
              alt="Foto del paciente"
              className="img-fluid mb-3 rounded-circle shadow-sm"
              style={{ maxHeight: "180px" }}
            />
            <h5 className="fw-bold text-info">
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
