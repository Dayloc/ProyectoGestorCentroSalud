import React, { useEffect } from "react";
import Fondo1 from "../assets/img/Fondo1.jpg";
import { loadMessage } from "../services/fetchs.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export function Home() {
	const { store, dispatch } = useGlobalReducer();


	useEffect(() => {
		loadMessage(dispatch);
	}, []);

	

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
							<h1 className="display-3 fw-bold">Bienvenido a MediGest</h1>
							<p className="lead">
								{store.message ? (
									<span className="text-success">{store.message}</span>
								) : (
									<span className="text-danger">
										Loading message from the backend (make sure your python 🐍 backend is running)...
									</span>
								)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
