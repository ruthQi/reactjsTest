import React, {Component} from 'react';
import {Link} from 'react-router';

class Operation extends Component{
   render(){
      return (
         <Link className="link" to="/user/add">添加用户</Link>
      )
   }
}

export default Operation;