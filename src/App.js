import React, { Component } from "react";
import "./App.css";
import EventEmitter from "events";

import MainComponent from "./components/MainComponent";
import Settings from "./components/Settings";

class App extends Component {
  state = {
    doRedoGrid: 0,
    sound: false,
    hardMode: false,
    mistakesMode: false
  };

  redoGridFunction() {
    this.doRedoGrid.emit("redoGrid");
  }

  handleSoundOption() {
    this.setState({
      sound: !this.state.sound
    });
  }

  handleHardMode() {
    this.setState({
      hardMode: !this.state.hardMode
    });
    this.redoGridFunction();
  }

  handleMistakesMode() {
    this.setState({
      mistakesMode: !this.state.mistakesMode
    });
    this.redoGridFunction();
  }

  constructor(props) {
    super(props);
    this.handleSoundOption = this.handleSoundOption.bind(this);
    this.handleHardMode = this.handleHardMode.bind(this);
    this.handleMistakesMode = this.handleMistakesMode.bind(this);
    this.doRedoGrid = new EventEmitter();
  }

  render() {
    return (
      <React.Fragment>
        <label htmlFor="toggle" className="toggleLabel arrowIt down"></label>
        <input type="checkbox" name="toggle" id="toggle" />
        <MainComponent
          sound={this.state.sound}
          hardMode={this.state.hardMode}
          mistakesMode={this.state.mistakesMode}
          doRedoGrid={this.doRedoGrid}
        />

        <div className="message">
          <Settings
            handleSoundOption={this.handleSoundOption}
            handleHardMode={this.handleHardMode}
            handleMistakesMode={this.handleMistakesMode}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
