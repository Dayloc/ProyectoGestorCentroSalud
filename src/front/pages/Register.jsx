import React from 'react'

function Register() {
  return (
       <div className=' login'>
        <div className='log'>
            <div className='credenciales'>
                <p>Por favor, ingrese email y password</p>
                <input className='name m-3'placeholder="Nombre..."type="text" />
                <input className='email m-3' placeholder='Email...' type="text" />
                <input className='password m-3'placeholder="Password..."type="text" />
                
                <button className='btn btn-primary'>Save</button>
            </div>
            
        </div>
      
    </div>
  )
}

export default Register
