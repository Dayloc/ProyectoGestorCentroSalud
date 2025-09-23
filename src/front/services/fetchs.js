const urlBase = import.meta.env.VITE_BACKEND_URL;

export const loadMessage = async (dispatch) => {
  try {
    const backendUrl = urlBase;

    if (!backendUrl)
      throw new Error("VITE_BACKEND_URL is not defined in .env file");

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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error("Error en el registro:", response.status);
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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });

    if (!response.ok) {
      throw new Error("Error en el registro:", response.status);
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

    const response = await fetch(`${urlBase}/api/paciente/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del paciente");
    }

    const data = await response.json();
    dispatch({
      type: "Save_Paciente",
      payload: data,
    });

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

    const response = await fetch(`${urlBase}/api/medico/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener datos del paciente");
    }

    const data = await response.json();
    dispatch({
      type: "Save_Medico",
      payload: data,
    });

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
export const getEspecialidades = async (dispatch) => {
  try {
    const response = await fetch(`${urlBase}/api/medicos`);
    if (!response.ok) {
      throw new Error("Error al optener los datos", response.status);
    }
    const data = await response.json();
    dispatch({
      type: "Especialidades",
      payload: data.map((medico) => medico.especialidad),
    });
  } catch (error) {
    console.error("Error", error);
  }
};
export const getMedicosLista = async (dispatch) => {
  try {
    const response = await fetch(`${urlBase}/api/medicos`);
    if (!response.ok) {
      throw new Error("Error al optener los datos", response.status);
    }
    const data = await response.json();
    dispatch({
      type: "Medicos",
      payload: data.map((medico) => medico),
    });
  } catch (error) {
    console.error("Error", error);
  }
};
export const getCitasPaciente = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${urlBase}/api/paciente/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al obtener citas del paciente");

    const data = await response.json();

    dispatch({
      type: "Citas_Paciente",
      payload: data.citas || [],
    });

    return data.citas || [];
  } catch (error) {
    console.error("Error getCitasPaciente:", error);
    return [];
  }
};
export const getCitasMedico = async (dispatch) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${urlBase}/api/medico/me`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Error al obtener citas del médico");

    const data = await response.json();

    dispatch({
      type: "Citas_Medico",
      payload: data.citas || [],
    });

    return data.citas || [];
  } catch (error) {
    console.error("Error getCitasMedico:", error);
    return [];
  }
};

export const tomarCita = async ({ medico_id, fecha, motivo }) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${urlBase}/api/citas/reservar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ medico_id, fecha, motivo }),
    });

    if (!response.ok) throw new Error("Error al reservar la cita");

    const data = await response.json();
    console.log("Cita reservada:", data);
    return data;
  } catch (error) {
    console.error("Error tomarCita:", error);
    throw error;
  }
};
export const getCitasDisponibles = async (medicoId) => {
  try {
    const token = localStorage.getItem("token"); // obtener token del paciente
    const response = await fetch(
      `${urlBase}/api/medicos/${medicoId}/citas-disponibles`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // importante para que el backend acepte la request
        },
      }
    );

    if (!response.ok) throw new Error("Error al obtener citas disponibles");

    const data = await response.json();
    return data; // lista de objetos de cita disponibles
  } catch (error) {
    console.error("Error getCitasDisponibles:", error);
    return [];
  }
};

export const registrarActividad = async (actividad, medicoId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No se encontró token en localStorage");

    const response = await fetch(
      `${urlBase}/api/medicos/${medicoId}/actividades`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: actividad.titulo,
          descripcion: actividad.descripcion || "",
          fecha_inicio: `${actividad.dia}T${actividad.horaInicio}`, // "2025-09-23T09:00"
          fecha_fin: `${actividad.dia}T${actividad.horaFin}`, // "2025-09-23T10:00"
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al registrar actividad");
    }

    const data = await response.json();
    console.log("Actividad registrada:", data);
    return data;
  } catch (error) {
    console.error("Error registrarActividad:", error);
    alert("No se pudo registrar la actividad");
    throw error;
  }
};
