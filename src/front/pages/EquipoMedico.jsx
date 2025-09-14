import React, { useEffect } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getMedicosLista } from '../services/fetchs';

function EquipoMedico() {
  const { store, dispatch } = useGlobalReducer();
  const { medicos } = store;

  useEffect(() => {
    getMedicosLista(dispatch);
  }, []);

  return (
    <div className='container my-5'>
      <h1 className='titulos text-center mb-4'>Contamos con profesionales como:</h1>
      <div className='row'>
        {medicos && medicos.map((medico, index) => (
          <div key={index} className='col-md-4 mb-3'>
            <div className='card shadow-sm h-100'>
              <div className='card-body'>
                <h5 className='card-title text-primary'>{medico.nombre}</h5>
                <p className='card-text'>
                  Especialidad: <span className='text-danger'>{medico.especialidad}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EquipoMedico;
