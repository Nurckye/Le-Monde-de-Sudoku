import React, { Component } from "react";
import Grid from "./Grid";
import OptionButton from "./OptionButton";
import Dashboard from "./Dashboard";
import NumberButton from "./NumberButton";

import EventEmitter from "events";
import Moment from "moment";
var gameNo = 5;

export const gameNoSolution = "No solution.";
export const gameRunningMessage = "Beat the record!";
export const gameRunningHardMode = "Hard mode on!";
export const gameRunningMistakesMode = "Hard mode on!";
export const gameOverMistakes = "5 Mistakes hit!";
export const gameCompleteMessage = "Game complete!";

class MainComponent extends Component {
  state = {
    startMoment: Moment().unix(),
    currentTimeDifference: 0,
    message: gameRunningMessage,
    currentPosition: {
      i: -1,
      j: -1
    }
  };

  handleFocus(i, j) {
    this.setState({
      currentPosition: {
        i: i,
        j: j
      }
    });
  }

  handleNumberClick(value) {
    if (
      this.state.currentPosition["i"] !== -1 &&
      this.state.currentPosition["j"] !== -1
    ) {
      // Event cu value, (i, j) in grid
      this.emitter.emit(
        "numberButtonClicked",
        value,
        this.state.currentPosition["i"],
        this.state.currentPosition["j"]
      );
    }
  }

  renderNumberButtons() {
    let res = [];
    for (let i = 1; i <= 9; ++i)
      res.push(
        <td key={i}>
          <NumberButton
            key={i}
            number={i}
            handleNumberClick={this.handleNumberClick}
            sound={this.props.sound}
          />
        </td>
      );
    return res;
  }

  constructor(props) {
    super(props);
    this.handleNewGame = this.handleNewGame.bind(this);
    this.gameFinished = this.gameFinished.bind(this);
    this.noSolution = this.noSolution.bind(this);
    this.resetMessageToOriginal = this.resetMessageToOriginal.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleNumberClick = this.handleNumberClick.bind(this);
    this.mistakesCounting = this.mistakesCounting.bind(this);
    this.mistakesNumberHit = this.mistakesNumberHit.bind(this);

    this.emitter = new EventEmitter();
    this.autofillEmitter = new EventEmitter();

    this.props.doRedoGrid.on("redoGrid", this.handleNewGame);

    this.intervalId = setInterval(() => {
      let diffTime = Moment().unix() - this.state.startMoment;
      this.setState({
        currentTimeDifference: diffTime
      });
    }, 1000);
  }

  handleNewGame() {
    this.setState({
      startMoment: Moment().unix(),
      currentTimeDifference: 0,
      message: gameRunningMessage
    });

    clearInterval(this.intervalId);

    this.intervalId = setInterval(() => {
      let diffTime = Moment().unix() - this.state.startMoment;
      this.setState({
        currentTimeDifference: diffTime
      });
    }, 1000);

    ++gameNo;
  }

  gameFinished() {
    this.setState({
      message: gameCompleteMessage
    });
    clearInterval(this.intervalId);
  }

  resetMessageToOriginal() {
    if (!this.props.mistakesMode)
      this.setState({
        message: gameRunningMessage
      });
  }

  noSolution() {
    this.setState({
      message: gameNoSolution
    });
  }

  mistakesNumberHit() {
    this.setState({
      message: gameOverMistakes
    });
    clearInterval(this.intervalId);
  }

  mistakesCounting(number) {
    this.setState({
      message: `${number}/5 mistakes`
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    return (
      <div key={1} className="mainContainer">
        <div className="titleContainer">
          <span>
            {/* <img className="logoImageSettings" src={logo512} alt="Logo"></img>{" "} */}
            <b>Le Monde de Sudoku</b>
          </span>
        </div>
        <Grid
          key={gameNo}
          gameFinished={this.gameFinished}
          noSolution={this.noSolution}
          resetMessageToOriginal={this.resetMessageToOriginal}
          handleFocus={this.handleFocus}
          autofillEmitter={this.autofillEmitter}
          emitter={this.emitter}
          currentPosition={this.state.currentPosition}
          sound={this.props.sound}
          hardMode={this.props.hardMode}
          mistakesMode={this.props.mistakesMode}
          mistakesNumberHit={this.mistakesNumberHit}
          mistakesCounting={this.mistakesCounting}
          boardFrozen={false}
        />
        <table key={2} className="dashboardTable">
          <tbody>
            <tr rowSpan="2" className="numbersRow">
              <td style={{ height: "100%" }} colSpan="2">
                <table className="numbers">
                  <tbody>
                    <tr>{this.renderNumberButtons()}</tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <Dashboard
                key={5}
                diffTime={this.state.currentTimeDifference}
                message={this.state.message}
              />
            </tr>
            <tr>
              <td>
                <OptionButton
                  key={3}
                  handleClick={this.handleNewGame}
                  name="New Game"
                />
              </td>
              <td>
                <OptionButton
                  key={4}
                  handleClick={() => {
                    this.autofillEmitter.emit("autofillClicked");
                  }}
                  name="Autofill board"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default MainComponent;
