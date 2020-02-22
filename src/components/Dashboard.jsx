import React, { Component } from "react";
import {
  gameRunningMessage,
  gameCompleteMessage,
  gameNoSolution,
  gameOverMistakes
} from "./MainComponent";

class Dashboard extends Component {
  formatDate(timeDiff) {
    let seconds = timeDiff % 60;
    let minutes = Math.floor(timeDiff / 60) % 60;
    let hours = Math.floor(timeDiff / 3600);

    if (seconds < 10) seconds = `0${seconds}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (hours < 10) hours = `0${hours}`;

    return `${hours}:${minutes}:${seconds}`;
  }

  constructor(props) {
    super(props);
    this.formatMessage = this.formatMessage.bind(this);
  }

  formatMessage() {
    if (this.props.message === gameRunningMessage)
      return (
        <React.Fragment>
          <td className="dashboardCell">
            {this.formatDate(this.props.diffTime)}
          </td>
          <td className="dashboardCell">{gameRunningMessage}</td>
        </React.Fragment>
      );
    if (this.props.message === gameCompleteMessage)
      return (
        <React.Fragment>
          <td className="dashboardCell">
            <b>{this.formatDate(this.props.diffTime)}</b>
          </td>
          <td className="dashboardCell" style={{ color: "green" }}>
            <b>{this.props.message}</b>
          </td>
        </React.Fragment>
      );

    if (this.props.message === gameNoSolution)
      return (
        <React.Fragment>
          <td className="dashboardCell">
            <b>{this.formatDate(this.props.diffTime)}</b>
          </td>
          <td className="dashboardCell" style={{ color: "red" }}>
            <b>{this.props.message}</b>
          </td>
        </React.Fragment>
      );

    if (
      this.props.message === gameNoSolution ||
      this.props.message === gameOverMistakes
    )
      return (
        <React.Fragment>
          <td className="dashboardCell">
            <b>{this.formatDate(this.props.diffTime)}</b>
          </td>
          <td className="dashboardCell" style={{ color: "red" }}>
            <b>{this.props.message}</b>
          </td>
        </React.Fragment>
      );

    return (
      <React.Fragment>
        <td className="dashboardCell">
          {this.formatDate(this.props.diffTime)}
        </td>
        <td className="dashboardCell" style={{ color: "red" }}>
          {this.props.message}
        </td>
      </React.Fragment>
    );
  }

  render() {
    return <React.Fragment>{this.formatMessage()}</React.Fragment>;
  }
}

export default Dashboard;
