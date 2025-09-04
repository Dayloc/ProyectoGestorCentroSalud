export const initialStore=()=>{
  return{
    message: null,
    listaCharacters:[]

  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){

    case 'saveCharacters':
    return{
      ...store,
      listaCharacters: action.payload
    }
   
    default:
      throw Error('Unknown action.');
  }    
}
