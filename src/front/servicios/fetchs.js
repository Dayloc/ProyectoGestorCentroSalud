const urlBase = "https://dragonball-api.com/api/"

//Get characters

export const getCharacters= async (dispatch) => {
    try {
        const response = await fetch(`${urlBase}characters` )
        if(!response.ok){
            throw new Error("Error al obtener los datos");
        }
        const data = await response.json()

        //console.log(data.items);

        dispatch({
            type: 'saveCharacters',
            payload:data.items
        })

        return data.items

    }catch (error) {
        console.error("Error", error)
    }
}