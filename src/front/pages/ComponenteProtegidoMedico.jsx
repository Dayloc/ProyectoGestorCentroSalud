
import React,{useEffect} from 'react'
import { getMedico } from '../services/fetchs'
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

function ComponenteProtegidoMedico() {
    const { store, dispatch } = useGlobalReducer();
     const {datosMedico} = store

     
useEffect(() => {
  getMedico(dispatch)
}, []);


    
  return (
    
    <div>
      <h1>Bienvenido  {datosMedico ? datosMedico.nombre: <p>cargando datos</p>}</h1>
    </div>
  )
}

export default ComponenteProtegidoMedico