import React, { useState } from "react"
import { Link } from "react-router-dom"

export const Login = () => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="d-flex justify-content-center align-items-center my-5">
            <div className="p-5 bg-primary" style={{ width: "40%", borderRadius: "15px" }}>
                <Link to="/register">
                    <button className="btn btn-success d-block ms-auto shadow">Registrarse</button>
                </Link>

                <h2 className="mb-5">Bienvenido de nuevo</h2>

                <div className="mx-auto" style={{ width: "50%" }}>
                    <input type="text" className="form-control mb-4" placeholder="DNI" />
                    <div className="input-group">
                        <input type={showPassword ? "text" : "password"} className="form-control" placeholder="Contraseña" />
                        <button type="button" className="btn btn-secondary shadow" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>
                </div>

                <div className="d-flex justify-content-between mt-5">
                    <button className="btn btn-danger shadow">Contraseña Olvidada</button>
                    <button className="btn btn-primary shadow">Iniciar Sesión</button>
                </div>
            </div>
        </div>
    )
}