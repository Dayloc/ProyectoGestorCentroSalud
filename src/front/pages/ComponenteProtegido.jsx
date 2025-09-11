
import React,{useEffect} from 'react'
import { getMedico } from '../services/fetchs';

function ComponenteProtegido() {

useEffect(() => {
    getMedico()
}, []);



    
  return (
    
    <div>
      <h1>Soy un componente protegido</h1>
    </div>
  )
}

export default ComponenteProtegido
