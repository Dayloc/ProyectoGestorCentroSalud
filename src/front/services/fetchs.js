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