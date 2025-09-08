export const initialStore=()=>{
  return{
    message: null,
    roll:""
  
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
      case " typeRoll":
        return {
          ...store,
          roll: action.payload
        }
    default:
      throw Error('Unknown action.');
  }    
}
