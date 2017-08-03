import Home from '../../components/family/familyHome';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import UserAddPage from '../../components/family/UserAdd';

ReactDOM.render((
   <Router history={hashHistory}>
      <Route path="/" component={Home}/>
      <Route path="/user/add" component={UserAddPage}/>
   </Router>
), document.getElementById('familyApp'));