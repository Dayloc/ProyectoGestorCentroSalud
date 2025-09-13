import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

const  Navbar = () => {

	const navigate = useNavigate()
	const { store, dispatch } = useGlobalReducer();
	
	const token = localStorage.getItem("token"); 
	
	//Sacamos el role del store

	const roleFormStore = store?.datosMedico
		? "medico"
		: store?.datosPaciente
		? "paciente"
		:null;
	const role = roleFormStore || localStorage.getItem("role");
	const isLogged = !!token && !!role;

	const navega = ()=> { 
		navigate("/login") 
	}

	const logout = ()=>{
		localStorage.removeItem("token");
		localStorage.removeItem("role");
		try {
			dispatch({ type: "Logout" }); //Limpiar datosPaciente/datosMedico 
		} catch {}
		navega("/");
	};

	return (
			
		<nav className="navbar navbar-expand-md navbar-light navbar-custom border-bottom">
			<div className="container">
				<Link className="navbar-brand d-flex align-items-center gap-2" href="/">
					{/*LOGO*/}
					<span className="d-inline-block rounded-circle bg-primary" style={{ width: 28, height: 28}} aria-hidden />
					<span className="fw-semibold">MediGest</span>
				</Link>

				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#mainNav"
					aria-controls="mainNav"
					aria-expanded="false"
					aria-label="Alternar navegación"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				
				<div className="collapse navbar-collapse" id="mainNav">
					<ul className="navbar-nav ms-auto align-items-md-center">
						{/* Visitante*/}
						{!isLogged && (
							<>
							  	<li className="nav-item">
									<Link className="nav-link" to="/">Inicio</Link>
								</li>
								<li className="nav-item ms-md-2">
									<button className="btn btn-primary" onClick={navega}>
										Login
									</button>
								</li>	
							</>
						)}

						{/* Navbar MÉDICO */}
            			{isLogged && role === "medico" && (
            			  <>
            			    <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            			    <li className="nav-item"><Link className="nav-link" to="/especialidades">Especialidades</Link></li>
            			    <li className="nav-item"><Link className="nav-link" to="/equipo">Equipo Médico</Link></li>
            			    <li className="nav-item"><Link className="nav-link" to="/perfil">Mi_Perfil</Link></li>
            			    <li className="nav-item ms-md-2">
            			      <button className="btn btn-primary" onClick={logout}>Logout</button>
            			    </li>
            			  </>
            			)}

						{/* Navbar PACIENTE */}
            			{isLogged && role === "paciente" && (
            			  <>
            			    <li className="nav-item"><Link className="nav-link" to="/">Inicio</Link></li>
            			    <li className="nav-item"><Link className="nav-link" to="/especialidades">Especialidades</Link></li>
            			    <li className="nav-item"><Link className="nav-link" to="/equipo">Equipo Médico</Link></li>
            			    <li className="nav-item"><Link className="nav-link" to="/area-paciente">Área Paciente</Link></li>
            			    <li className="nav-item"><Link className="nav-link" to="/perfil">Mi_Perfil</Link></li>
            			    <li className="nav-item ms-md-2">
            			      <button className="btn btn-primary" onClick={logout}>Logout</button>
            			    </li>
            			  </>
            			)}
					</ul>
				</div>
			</div>
		</nav>
	);
};
export default Navbar