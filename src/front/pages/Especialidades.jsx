import React, { useEffect } from 'react'
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getEspecialidades } from '../services/fetchs.js';
import especilidades_data from "./../informacion/info.js"

function Especialidades() {
  const { store, dispatch } = useGlobalReducer();
  const { especialidades } = store;

  useEffect(() => {
    getEspecialidades(dispatch)
  }, []);

  return (
    <div className='container espec'>
      <h3 className='titulos'>Especialidades que podrá encontrar en nuestro centro</h3> 
      <div className='d-flex flex-column justify-content-start align-content-start'>
        {especialidades && especialidades.map((especialidad, index) => (
          <div className='especialidad-list m-1 d-flex flex-column' key={index}>
            <h5>{especialidad}</h5>
            <p className='text-warning'>{especilidades_data[especialidad]}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Especialidades
