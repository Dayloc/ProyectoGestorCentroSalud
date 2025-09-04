import React, { useEffect } from "react"

import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getCharacters } from "../servicios/fetchs.js";


export const Home = () => {
	const { store, dispatch } = useGlobalReducer() //acceso a store, accciones del storeReducer(dispatch)

	const{listaCharacters} = store
	
	
	useEffect(() => {
		getCharacters(dispatch)
	}, []);

	
	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			{
				listaCharacters && listaCharacters.map((character)=>
					<div key ={character.id}>{character.name}</div>
				)
			}
			
		</div>
	);
}; 