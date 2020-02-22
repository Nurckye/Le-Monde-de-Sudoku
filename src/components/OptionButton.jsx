import React, { Component } from "react";

class OptionButton extends Component {
  render() {
    return <button onClick={this.props.handleClick}>{this.props.name}</button>;
  }
}

export default OptionButton;
