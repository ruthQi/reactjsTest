import React, {Component} from 'react';

class Button extends Component{

   changeName(){
      //this.props.changeName('haha');
      this.props.actions.changeName('haha')
   }
   render(){
      return(
         <button onClick={()=>{this.changeName()}}>changeName</button>
      )
   }
}

export default Button;