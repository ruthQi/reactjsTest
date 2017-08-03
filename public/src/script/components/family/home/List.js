import React, {Component} from 'react';
var $ = require('../../../library/jquery.js');

class List extends Component{
   constructor() {
      super();
      this.state = {
         array: []
      };
   }

   componentWillMount() {
      $.get('http://localhost:3000/user').then((json) => {
         this.setState({
            array : json
         });
      });
   }

   renderList() {
      return this.state.array.map((item, idx) => (<li key={idx}>{item.name}</li>));
   }

   render(){
      console.log(1);
      return (
         <ul>
            {this.renderList()}
         </ul>
      )
   }
}
export default List;