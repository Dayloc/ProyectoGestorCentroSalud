import React,{useEffect} from 'react'
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getMedicosLista } from '../services/fetchs'


function EquipoMedico() {
  const { store, dispatch } = useGlobalReducer();
  const{medicos} = store

  useEffect(() => {
    getMedicosLista(dispatch)
  }, []);
    console.log(medicos)
  return (
    <div className='container d-flex flex-column justify-content-center align-items-center'>
      <h1 className='titulos'>Contamos con profesionales como:</h1>
      <div>
        {medicos && medicos.map((medico,index)=>
        <div key={index}><span className='text-primary'>{medico.nombre}</span>  especialidad: <span className='text-danger'>{medico.especialidad}</span></div>
        )}
      </div>
    </div>
  )
}

export default EquipoMedico
