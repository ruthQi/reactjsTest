var React = require('react');
var ReactDOM = require('react-dom');
import { createStore } from 'redux';
import Counter from '../components/Counter'

const reducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    default: return state;
  }
};

const store = createStore(reducer);

const render = () => {
  ReactDOM.render(
    <Counter value={store.getState()} onIncrement={() => store.dispatch({ type: 'INCREMENT' })} onDecrement={() => store.dispatch({ type: 'DECREMENT' })}/>,
    document.getElementById('root')
  );
};

render();
store.subscribe(render);