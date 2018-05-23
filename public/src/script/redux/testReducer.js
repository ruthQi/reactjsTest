import {actionType} from './testAction';
import {combineReducers} from 'redux';

function changeValue(state = {name:'hello'}, action){
   switch(action.type){
      case actionType.CHANGE_NAME:
         return Object.assign({}, state, {name: action.name});
         break;
      default:
         return state;
         break;
   }
      
}

//export default changeValue;
//使用combineReducers，在调用的时候在store.changeValue.xxx获取值
export default combineReducers({changeValue}) ;