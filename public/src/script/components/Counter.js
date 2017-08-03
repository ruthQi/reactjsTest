import React, { Component, PropTypes } from 'react'

class Counter extends Component {
  render() {
    //const { value, onIncrement, onDecrement } = this.props
    return (
      <p>
        Clicked: {this.props.value} times
        {' '}
        <button onClick={this.props.onIncrement}>
          +
        </button>
        {' '}
        <button onClick={this.props.onDecrement}>
          -
        </button>
      </p>
    )
  }
}

export default Counter