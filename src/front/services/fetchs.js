const urlBase = import.meta.env.VITE_BACKEND_URL;

export const loadMessage = async (dispatch) => {
		try {
			const backendUrl = urlBase;

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

			const response = await fetch(backendUrl + "/api/hello");
			const data = await response.json();

			if (response.ok) 
				dispatch({ type: "update_menssage", payload: data.message });

			return data;
		} catch (error) {
			if (error.message)
				throw new Error(
					`Could not fetch the message from the backend.
					Please check if the backend is running and the backend port is public.`
				);
		}
	};

	// Register Paciente
	export const registerPaciente = async (datos) => {
	
  try {
    const response = await fetch(`${urlBase}/api/register/paciente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error('Error en el registro:',response.status);
    }

    const data = await response.json();
    console.log("Registro exitoso:", data);
    return data;
  } catch (error) {
    console.log("Error:", error);
    alert("Error al registrar paciente");
    throw error;
  }
};

//register medico
export const registerMedico = async (datos) => {
		
  try {
    const response = await fetch(`${urlBase}/api/register/medico`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    if (!response.ok) {
      throw new Error('Error en el registro:',response.status);
    }

    const data = await response.json();
    console.log("Registro exitoso:", data);
    return data;
  } catch (error) {
    console.log("Error:", error);
    alert("Error al registrar el médico");
    throw error;
  }
};


// login paciente
export const loginPaciente = async (datos) => {
  try {
    const response = await fetch(`${urlBase}/api/login/paciente`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(`Error en login paciente: ${response.status}`);
    }

    const data = await response.json();
    console.log("Login paciente exitoso:", data);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Error en login paciente:", error);
    throw error;
  }
};

// login medico
export const loginMedico = async (datos) => {
  try {
    const response = await fetch(`${urlBase}/api/login/medico`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error(`Error en login medico: ${response.status}`);
    }

    const data = await response.json();
    console.log("Login medico exitoso:", data);

   
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (error) {
    console.error("Error en login medico:", error);
    throw error;
  }
};

// get paciente
export const getPaciente = async (dispatch) => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await fetch(`${urlBase}api/paciente/me`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },    
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del paciente");
    }

    const data = await response.json();
     dispatch({
      type:"Save_Paciente",
      payload:data
    })
    
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
// get médico
export const getMedico = async (dispatch) => {
  try {
    const token = localStorage.getItem("token"); 

    const response = await fetch(`${urlBase}api/medico/me`, { 
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },    
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del paciente");
    }

    const data = await response.json();
    dispatch({
      type:"Save_Medico",
      payload:data
    })
    
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getEspecialidades = async(dispatch)=>{
  try {
    const response = await fetch(`${urlBase}api/medicos`)
    if(!response.ok){
      throw new Error("Error al optener los datos",response.status);      
    }
    const data  = await response.json()
    dispatch({
      type:"Especialidades",
      payload: data.map(medico=>medico.especialidad)
    })
  } catch (error) {
    console.error("Error", error)
  }

}
export const getMedicosLista = async(dispatch)=>{
  try {
    const response = await fetch(`${urlBase}api/medicos`)
    if(!response.ok){
      throw new Error("Error al optener los datos",response.status);      
    }
    const data  = await response.json()
    dispatch({
      type:"Medicos",
      payload: data.map( medico=>medico )
    })
  } catch (error) {
    console.error("Error", error)
  }

}