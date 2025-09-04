import { Link } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {
	const [role,setRole] = useState("paciente")

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{
						role === "paciente" ? <Link to="/demo">
						<button className="btn btn-primary">Paciente</button>
					</Link> : <Link to="/demo">
						<button className="btn btn-primary">Médico</button>
					</Link>	
					}
					
				  
				</div>
				<button className="btn btn-primary" onClick={()=>setRole("medico")}> Cambia a Médico</button>
			</div>
		</nav>
	);
};