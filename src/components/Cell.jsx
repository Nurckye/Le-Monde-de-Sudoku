import React, { Component } from "react";

import cellClick from "../audio/click1.mp3";
const audio = new Audio(cellClick);

class Cell extends Component {
  formatCell(isDefault, number, color) {
    if (isDefault || this.props.boardFrozen)
      return (
        <div className="givenValue">
          <span>
            <b>{number === -1 ? "" : number}</b>
          </span>
        </div>
      );
    return (
      <div
        className={`${color} ${this.props.classIfCurrent} givenValue`}
        onClick={() => {
          this.props.handleFocus(this.state["i"], this.state["j"]);
          if (this.props.sound) audio.play();
        }}
        onDoubleClick={() => {
          this.props.handleDelete(this.state["i"], this.state["j"]);
        }}
      >
        {number === -1 ? "" : number}
      </div>
    );
  }

  constructor(props) {
    super(props);
    this.state = {
      i: this.props.i,
      j: this.props.j
    };
  }
  render() {
    let { isDefault, number, color } = this.props.value;

    return (
      <React.Fragment>
        <td>{this.formatCell(isDefault, number, color)}</td>
      </React.Fragment>
    );
  }
}

export default Cell;
