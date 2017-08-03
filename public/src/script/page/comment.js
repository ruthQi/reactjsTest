//var React = require('react');
var ReactDOM = require('react-dom');
import React, { Component, PropTypes } from 'react';

var data = [
  {id: 1, author: "Pete Hunt1", text: "This is one comment"},
  {id: 2, author: "Jordan Walke1", text: "This is *another* comment"}
];

class Comment extends Component{
   render(){
      return(
         <div className="comment">
            <h2 className="commentAnchor">
               {this.props.author}
            </h2>
            {this.props.children}
         </div>
      )
   }
}

class CommentList extends Component{
   render() {
      return (
         <div className="commentList">
            <Comment author="Pete Hunt">This is a Comment</Comment>
            <Comment author="Jordan Walke">This is *anchor* Comment</Comment>
         </div>
      )
   }
}

class CommentList1 extends Component{
   render() {
      var commentNodes = this.props.data1.map(function(comment) {
         return (
           <Comment author={comment.author} key={comment.id}>
             {comment.text}
           </Comment>
         );
       });
      return(
         <div className="comment">
            {commentNodes}
         </div>
      )
   }
}
class CommentForm extends Component{
   render() {
      return (
         <div className="commentForm">
            Hello, Dear!I am a CommentForm.
         </div>
      )
   }
}

class CommentBox extends Component{
  render() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList1 data1={this.props.data1}/>
        <CommentForm />
      </div>
    );
  }
}
ReactDOM.render(
  <CommentBox data1={data}/>,
  document.getElementById('content')
);