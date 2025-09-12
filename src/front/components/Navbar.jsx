import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const  Navbar = () => {

	const navigate = useNavigate()
	const navega = ()=>{
		navigate("/login")

	}
	const token = localStorage.getItem("token"); 

	const logout = ()=>{
		localStorage.removeItem("token");
		navega()

	}

	return (
			
		<nav className="navbar navbar-expand-md navbar-light navbar-custom border-bottom">
			<div className="container">
				<a className="navbar-brand d-flex align-items-center gap-2" href="/">
					{/*LOGO*/}
					<span className="d-inline-block rounded-circle bg-primary" style={{ width: 28, height: 28}} aria-hidden />
					<span className="fw-semibold">MediGest</span>
				</a>

				<ul className="navbar-nav ms-3">
					<li className="nav-item">
						<a className="nav-link active" aria-current="page" href="/">Inicio</a>
					</li>
				</ul>
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
				{
					token ? <div className="collapse navbar-collapse" id="mainNav">
					<ul className="navbar-nav ms-auto align-items-md-center">
						<li className="nav-item ms-md-2">
							<button className="btn btn-primary" onClick={()=>logout()}>Logout</button>
						</li>
					</ul>
				</div>:<div className="collapse navbar-collapse" id="mainNav">
					<ul className="navbar-nav ms-auto align-items-md-center">
						<li className="nav-item ms-md-2">
							<button className="btn btn-primary" onClick={()=>navega()}>Login</button>
						</li>
					</ul>
				</div>
				}
				
			</div>
		</nav>
	);
};
export default Navbar