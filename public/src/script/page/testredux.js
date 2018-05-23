import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Container from '../components/testIndex';
import configureStore from '../redux/createStore';
import reducer from '../redux/testReducer';


let store = configureStore(reducer);

class TestRedux extends Component{
   render(){
      return(
         <Provider store={store}>
            <Container />
         </Provider>
      )
   }
}

ReactDOM.render(<TestRedux /> , document.getElementById('test-redux'));