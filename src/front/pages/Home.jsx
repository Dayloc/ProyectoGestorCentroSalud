import React from "react";
import Fondo1 from "../assets/img/Fondo1.jpg";


export function Home() {
	
	return (
		<section
			className="h-100 d-flex align-items-center position-relative"
			style={{
				backgroundImage: `url(${Fondo1})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				height: "100%",
			}}
		>
			<div className="container py-4 py-md-5">
				<div className="row justify-content-center">
					<div className="col-12 col-lg-10">
						<div className="bg-white bg-opacity-25 rounded-4 shadow-sm p-4 p-md-5">
							<h1 className="display-3 fw-semibold text-center mb-3">Benvenido a MediGest</h1>
							<p className="lead text-center text-muted mb-0">Este es el contenido principal de la home.</p>
						</div>
					</div>
				</div>		
			</div>
		</section>
	);	
}