import React from "react";
import Fondo1 from "../assets/img/Fondo1.jpg";


export function Home() {
	
	return (
		<section
			className="flex-fill d-flex align-items-center justify-content-center text-white"
			style={{
				backgroundImage: `url(${Fondo1})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				borderRadius: "5px",
				height: "100vh",
			}}
		>
			<div className="container py-4 py-md-5">
				<div className="row justify-content-center">
					<div className="col-12 col-lg-10">
						<div className="container text-center bg-dark bg-opacity-25 p-5 rounded-4 p-4">
							<h1 className="display-3 fw-bold">Benvenido a MediGest</h1>
							<p className="lead">Este es el contenido principal de la home.</p>
						</div>
					</div>
				</div>		
			</div>
		</section>
	);	
}