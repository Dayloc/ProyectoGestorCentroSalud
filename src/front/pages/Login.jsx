import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginPaciente, loginMedico } from "../services/fetchs";

function Login() {
  const [roll, setRoll] = useState("paciente"); // por defecto paciente
  const [datos, setDatos] = useState({
    email: "",
    password: "",
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

  // Manejar envío
  const handleSubmit = async () => {
    try {
      if (roll === "paciente") {
        await loginPaciente(datos);
      } else {
        await loginMedico(datos);
      }
      navigate("/dashboard"); // redirigir a donde quieras tras login
    } catch (error) {
      alert("Error en las credenciales");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Login</h3>

        <p className="mb-2">Indique si es:</p>
        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            name="radioDefault"
            id="radioPaciente"
            value="paciente"
            onChange={() => setRoll("paciente")}
            checked={roll === "paciente"}
          />
          <label className="form-check-label" htmlFor="radioPaciente">
            Paciente
          </label>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="radio"
            name="radioDefault"
            id="radioMedico"
            value="medico"
            onChange={() => setRoll("medico")}
            checked={roll === "medico"}
          />
          <label className="form-check-label" htmlFor="radioMedico">
            Médico
          </label>
        </div>

        <p className="fw-semibold">Por favor, ingrese sus credenciales:</p>

        <input
          className="form-control mb-3"
          placeholder="Email..."
          type="email"
          name="email"
          value={datos.email}
          onChange={handleChange}
        />
        <input
          className="form-control mb-3"
          placeholder="Password..."
          type="password"
          name="password"
          value={datos.password}
          onChange={handleChange}
        />

        <button className="btn btn-primary w-100 mb-3" onClick={handleSubmit}>
          Iniciar Sesión
        </button>

        <p className="text-center">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/register">
            <span className="text-primary">Regístrate aquí</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
