import React, { Component } from "react";

class SliderButton extends Component {
  render() {
    return (
      <label className="switch">
        <input
          type="checkbox"
          id="togBtn"
          onChange={this.props.onChangeHandler}
        />
        <div className="slider round">
          <span className="on">ON</span>
          <span className="off">OFF</span>
        </div>
      </label>
    );
  }
}

export default SliderButton;
