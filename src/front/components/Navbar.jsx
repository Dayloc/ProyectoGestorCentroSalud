import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import logo from "../assets/img/logo!!.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { store, dispatch } = useGlobalReducer();

  const token = localStorage.getItem("token");
  // Obtenemos el rol primero del store, si no existe, de localStorage
  const roleFromStore = store?.datosMedico ? "medico" : store?.datosPaciente ? "paciente" : null;
  const role = roleFromStore || localStorage.getItem("role"); 
  const isLogged = !!token && !!role;

  const handleLogin = () => navigate("/login");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    try {
      dispatch({ type: "Logout" }); // Limpiar store
    } catch {}
    navigate("/");
  };

  // Determinar link a área protegida según rol
  const protectedLink = role === "medico" ? "/dashboardMedico" : "/dashboardPaciente";
  const protectedLabel = role === "medico" ? "Área Médico" : "Área Paciente";

  return (
    <nav className="navbar navbar-expand-md navbar-light navbar-custom border-bottom">
      <div className="container">
        <Link className="navbar-brand d-flex flex-column align-items-center gap-2" to="/">
          <img className="logo" src={logo} alt="Logo" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-md-center">
            {/* Links comunes */}
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/especialidades">Especialidades</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/equipoMedico">Equipo Médico</Link>
            </li>

            {/* Área protegida */}
            {isLogged && (
              <li className="nav-item">
                <Link className="nav-link" to={protectedLink}>{protectedLabel}</Link>
              </li>
            )}

            {/* Login / Logout */}
            <li className="nav-item ms-md-2">
              {isLogged ? (
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
              ) : (
                <button className="btn btn-primary" onClick={handleLogin}>Login</button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
