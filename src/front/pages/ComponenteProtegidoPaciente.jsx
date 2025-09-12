
import React,{useEffect} from 'react'
import { getPaciente } from '../services/fetchs'
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

function ComponenteProtegidoPaciente() {
  const { store, dispatch } = useGlobalReducer();
  const {datosPaciente} = store

useEffect(() => {
  getPaciente(dispatch)
}, []);


    
  return (
    
    <div className='text-center'>
      <h1>Bienvenido  {datosPaciente ? datosPaciente.nombre: <p>cargando datos</p>}</h1>
    </div>
  )
}

export default ComponenteProtegidoPaciente
