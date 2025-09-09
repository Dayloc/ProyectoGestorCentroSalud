export const initialStore=()=>{
  return{
    message: null,
    
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case "update_menssage":
      return{
        ...store,
        message: action.payload
      }

   
      
    default:
      throw Error('Unknown action.');
  }    
}
