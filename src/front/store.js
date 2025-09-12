export const initialStore=()=>{
  return{
    message: null,
    datosPaciente:null,
    datosMedico:null
    
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case "update_menssage":
      return{
        ...store,
        message: action.payload
      }
       case "Save_Paciente":
      return{
        ...store,
        datosPaciente: action.payload
      }
            case "Save_Medico":
      return{
        ...store,
        datosMedico: action.payload
      }

   
      
    default:
      throw Error('Unknown action.');
  }    
}
