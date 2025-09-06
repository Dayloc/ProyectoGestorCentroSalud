import React from "react";


export function Footer() {
	return (
			//Footer en Acordeón

		<footer className="footer-custom border-top py-4 mt-auto">
			<div className="container">
				<div className="row g-4">
					{/* Dirección física */}
					<div className="col-12 col-md-3">
						<button
							className="btn w-100 text-start p-0 border-0 bg-transparent"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#footerDireccion"
							aria-expanded="false"
							aria-controls="footerDireccion"
						>
						<h6 className="text-uppercase small fw-bold mb-2">📍 Dirección Física</h6>
						</button>
						<div id="footerDireccion" className="collapse">
							<ul className="list-unstyled small mb-0">
								<li>Clínica VidaPlena</li>
								<li>#</li>
								<li>#</li>								
							</ul>
						</div>
					</div>

						{/* Teléfono / WhatsApp */}

					<div className="col-12 col-md-3">
						<button
							className="btn w-100 text-start p-0 border-0 bg-transparent"
							type="button"
		   					data-bs-toggle="collapse"
							data-bs-target="#footerTelefono"
							aria-expanded="false"
							aria-controls="footerTelefono"
						>
						<h6 className="text-uppercase small fw-bold mb-2">📞 Teléfono/WhatsApp</h6>
						</button>
						<div id="footerTelefono" className="collapse">
							<ul className="list-unstyled small mb-0">
								<li>+34 600 000 000</li>
								<li>+34 911 000 000</li>
							</ul>
						</div>
					</div>

						{/* Correo Electrónico */}

					<div className="col-12 col-md-3">
						<button
							className="btn w-100 text-start p-0 border-0 bg-transparent"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#footerCorreo"
							aria-expanded="false"
							aria-controls="footerCorreo"
						>
						 	<h6 className="text-uppercase small fw-bold mb-3">📧 Correo Electrónico</h6>
					 	</button>
					 	<div id="footerCorreo" className="collapse">
						 	<ul className="list-unstyled small mb-0">
							 	<li>info@medigest.app</li>
							 	<li>soporte@medigest.app</li>
						 	</ul>
					 	</div>
				 	</div>

					 	{/* Redes Sociales */}

				 	<div className="col-12 col-md-3">
					 	<button
						 	className="btn w-100 text-start p-0 border-0 bg-transparent"
						 	type="button"
						 	data-bs-toggle="collapse"
						 	data-bs-target="#footerRedes"
						 	aria-expanded="false"
						 	aria-controls="footerRedes"
					 	>
						 	<h6 className="text-uppercase small fw-bold mb-3">🌐 Redes Sociales</h6>
					 	</button>
					 	<div id="footerRedes" className="collapse">
						 	<ul className="list-unstyled small mb-0">
							 	<li><a href="#" className="link-secondary text-decoration-none">Instagram</a></li>
							 	<li><a href="#" className="link-secondary text-decoration-none">Facebook</a></li>
							 	<li><a href="#" className="link-secondary text-decoration-none">x/Twitter</a></li>
						 	</ul>
					 	</div>
				 	</div>
			 	</div>

				<div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 pt-3 border-top small-secondary">
					<div>® {new Date().getFullYear()} VidaPlena. Todos los derechos reservados.</div>
					<div className="mt-2 mt-md-0 d-flex gap-3">
						<a href="#" className="link-secondary text-decoration-none">Accesibilidad</a>
						<a href="#" className="link-secondary text-decoration-none">Privacidad</a>
						<a href="#" className="link-secondary text-decoration-none">Cookies</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
