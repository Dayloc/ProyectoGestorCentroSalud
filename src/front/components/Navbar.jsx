import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">Inicio</span>
				</Link>
				<div className="ml-auto">
					<Link to="/login">
						<span className="navbar-brand mb-0 h1">Login</span>
					</Link>
				</div>
			</div>
		</nav>
	);
};