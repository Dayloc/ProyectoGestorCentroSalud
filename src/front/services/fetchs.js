const urlBase = import.meta.env.VITE_BACKEND_URL;

// Este es un fetch de prueba para que tengan un una guía, utilicen urlBase para que no tengan conflictos a la hora de hacerlos
export const getDataUsers = async () => {
  try {
    const response = await fetch(`${urlBase}/api/users`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos");
    }
    const data = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.log(error);
  }
};
