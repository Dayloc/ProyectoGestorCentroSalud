import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function AgendaActividadesMedico() {
  const [actividades, setActividades] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nuevaActividad, setNuevaActividad] = useState({ paciente: "", start: null, end: null });

  // Cargar actividades simuladas
  useEffect(() => {
    const datosSimulados = [
      {
        id: 1,
        paciente: "Juan Pérez",
        start: new Date(2025, 8, 18, 9, 0),
        end: new Date(2025, 8, 18, 9, 30),
        tipo: "Consulta",
        title: "Consulta: Juan Pérez",
      },
      {
        id: 2,
        paciente: "María López",
        start: new Date(2025, 8, 18, 10, 30),
        end: new Date(2025, 8, 18, 11, 0),
        tipo: "Control",
        title: "Control: María López",
      },
    ];
    setActividades(datosSimulados);
  }, []);

  // Abrir modal al seleccionar un slot
  const handleSelectSlot = ({ start, end }) => {
    setNuevaActividad({ paciente: "", start, end });
    setModalOpen(true);
  };

  // Guardar nueva cita
  const handleGuardarActividad = () => {
    if (!nuevaActividad.paciente) return; // validar paciente
    const nueva = {
      id: actividades.length + 1,
      paciente: nuevaActividad.paciente,
      start: nuevaActividad.start,
      end: nuevaActividad.end,
      tipo: "Consulta",
      title: `Consulta: ${nuevaActividad.paciente}`, // obligatorio para react-big-calendar
    };
    setActividades([...actividades, nueva]);
    setModalOpen(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agenda de Actividades del Médico</h2>

      <Calendar
        localizer={localizer}
        events={actividades.filter(ev => ev && ev.title && ev.start && ev.end)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: "20px 0" }}
        selectable
        onSelectSlot={handleSelectSlot}
        views={["week", "day"]}
      />

      {/* Modal casero */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
            }}
          >
            <h3>Agregar Nueva Cita</h3>
            <label>Paciente:</label>
            <input
              type="text"
              value={nuevaActividad.paciente}
              onChange={(e) =>
                setNuevaActividad({ ...nuevaActividad, paciente: e.target.value })
              }
              style={{ width: "100%", padding: "5px", marginTop: "5px" }}
            />
            <div style={{ marginTop: "15px", display: "flex", justifyContent: "space-between" }}>
              <button onClick={handleGuardarActividad}>Guardar</button>
              <button onClick={() => setModalOpen(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AgendaActividadesMedico;
