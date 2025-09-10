import React from 'react'
import { Link } from 'react-router-dom'

function Login() {


  return (
    <div className=' login'>
        <div className='log'>
            <div className='credenciales'>
                <p>Por favor, ingrese email y password</p>
                <input className='email m-3' placeholder='Email...' type="text" />
                <input className='password m-3'placeholder="Password..."type="text" />
                <p>Si aun no tiene  cuenta , debe <Link to="/register"><span className='text-primary'>Registrarse...</span></Link></p>
            </div>
            
        </div>
      
    </div>
  )
}

export default Login
