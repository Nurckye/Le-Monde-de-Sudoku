import React, { Component } from "react";

import numberClick from "../audio/click2.mp3";
const audio = new Audio(numberClick);

class NumberButton extends Component {
  render() {
    return (
      <button
        className="numberButton"
        onClick={() => {
          this.props.handleNumberClick(this.props.number);
          if (this.props.sound) audio.play();
        }}
      >
        {this.props.number}
      </button>
    );
  }
}

export default NumberButton;
