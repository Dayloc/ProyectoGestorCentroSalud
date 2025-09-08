import React, { useState } from "react";

function CheckBox() {
  const [type, setType] = useState("");

  const handleChange = (e) => {
    setType(e.target.value);
  };

  return (
    <div className="container check">
      <ul>
        <li>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="rol"
              id="admin"
              value="Administrador"
              onChange={handleChange}
              checked={type === "Administrador"}
            />
            <label className="form-check-label" htmlFor="admin">
              Administrador
            </label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="rol"
              id="paciente"
              value="Paciente"
              onChange={handleChange}
              checked={type === "Paciente"}
            />
            <label className="form-check-label" htmlFor="paciente">
              Paciente
            </label>
          </div>
        </li>
        <li>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="rol"
              id="medico"
              value="Médico"
              onChange={handleChange}
              checked={type === "Médico"}
            />
            <label className="form-check-label" htmlFor="medico">
              Médico
            </label>
          </div>
        </li>
      </ul>

      <p>Rol seleccionado: {type}</p>
    </div>
  );
}

export default CheckBox;
