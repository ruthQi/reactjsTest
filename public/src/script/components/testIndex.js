import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import actions from '../redux/testAction';
import Button from './../components/test/button';

class TestIndex extends Component{
   render(){
      console.log(this.props)
      return(
         <div>
            <div>{/*this.props.store.name*/ this.props.store.changeValue.name}</div>
            <Button {...this.props}/>
         </div>
      )
   }
}
//state添加到props
function mapStateToProps(state){
   return {store: state};
}
//把action添加到props,调用action时。dispatch此action，reducer触发对应action改变store
function mapDispatchToProps(dispatch){
   //return bindActionCreators(actions, dispatch);
   return {actions: bindActionCreators(actions, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(TestIndex);