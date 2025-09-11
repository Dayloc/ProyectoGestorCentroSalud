import React, { useState } from "react";
import { registerMedico, registerPaciente } from "../services/fetchs";
import { useNavigate } from "react-router-dom";

function Register() {
  const [roll, setRoll] = useState("paciente");
  const [datos, setDatos] = useState({
    nombre: "",
    email: "",
    fecha_nacimiento: "",
    password: "",
    especialidad: "",
  });

  const navigate = useNavigate();

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos({
      ...datos,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (roll === "paciente") {
        await registerPaciente(datos);
      } else {
        await registerMedico(datos);
      }
      navigate("/login");
    } catch (error) {
      console.error("Error en el registro:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 ">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Registro</h3>

        <p className="mb-2">Indique si es:</p>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="radioDefault"
            id="radioDefault1"
            value="paciente"
            onChange={() => setRoll("paciente")}
            checked={roll === "paciente"}
          />
          <label className="form-check-label" htmlFor="radioDefault1">
            Paciente
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="radio"
            name="radioDefault"
            id="radioDefault2"
            value="medico"
            onChange={() => setRoll("medico")}
            checked={roll === "medico"}
          />
          <label className="form-check-label" htmlFor="radioDefault2">
            Médico
          </label>
        </div>

        {/* Formulario dinámico */}
        <div>
          <p className="fw-semibold">Por favor, ingrese sus datos:</p>
          <input
            className="form-control mb-3"
            placeholder="Nombre..."
            type="text"
            name="nombre"
            value={datos.nombre}
            onChange={handleChange}
          />
          <input
            className="form-control mb-3"
            placeholder="Email..."
            type="email"
            name="email"
            value={datos.email}
            onChange={handleChange}
          />

          {roll === "paciente" && (
            <input
              className="form-control mb-3"
              placeholder="Fecha de nacimiento..."
              type="date"
              name="fecha_nacimiento"
              value={datos.fecha_nacimiento}
              onChange={handleChange}
            />
          )}

          {roll === "medico" && (
            <input
              className="form-control mb-3"
              placeholder="Especialidad..."
              type="text"
              name="especialidad"
              value={datos.especialidad}
              onChange={handleChange}
            />
          )}

          <input
            className="form-control mb-3"
            placeholder="Password..."
            type="password"
            name="password"
            value={datos.password}
            onChange={handleChange}
          />

          <button className="btn btn-primary w-100" onClick={handleSubmit}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
