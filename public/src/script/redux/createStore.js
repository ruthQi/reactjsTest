import {createStore} from 'redux';

export default function configureStore(rootReducer, initialState = {}){
   return createStore(rootReducer, initialState);
}