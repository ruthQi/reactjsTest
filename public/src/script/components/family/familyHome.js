import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';
import Header from './home/header';
import List from './home/List';
import Operation from './home/Operation';

class Home extends Component{
   render(){
      return (
         <div>
            <Header />
            <List />
            <Operation />
         </div>
      )
   }
}

export default Home;