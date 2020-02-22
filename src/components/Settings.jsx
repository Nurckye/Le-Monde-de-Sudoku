import React, { Component } from "react";
import SliderButton from "./SliderButton";

import instagram from "../images/instagram.png";
import facebook from "../images/facebook.png";
import linkedin from "../images/linkedin.png";
import github from "../images/github.png";
import logo512 from "../images/logo512.png";

const instagramUrl = "https://www.instagram.com/nurckye/";
const facebookUrl = "https://www.facebook.com/radu.nitescu.14";
const linkedinUrl = "https://www.linkedin.com/in/radu-ni%C8%9Bescu-73b3628b/";
const githubUrl = "https://github.com/Nurckye";

class Settings extends Component {
  formatOption(name, functionOnToggle) {
    return (
      <div key={name} className="settingsOption">
        <span className="settingsOptionName">{name}</span>{" "}
        <SliderButton key={name} onChangeHandler={functionOnToggle} />
      </div>
    );
  }

  formatImages(imgArr) {
    return imgArr.map((value, index) => (
      <a key={index} href={value["url"]}>
        <img
          src={value["name"]}
          alt={"Social Media"}
          className="socialMedia"
        ></img>
      </a>
    ));
  }

  formatSettings(settingsArr) {
    return settingsArr.map((value, index) =>
      this.formatOption(value["name"], value["function"])
    );
  }

  render() {
    return (
      <div>
        <label htmlFor="toggle" className="toggleLabel arrowIt up"></label>

        <div key={1} className="settingsTitle">
          Settings
        </div>
        {this.formatSettings([
          { name: "Sound", function: this.props.handleSoundOption },
          { name: "Hard mode", function: this.props.handleHardMode },
          { name: "5 Mistakes Mode", function: this.props.handleMistakesMode }
        ])}
        <img className="logoImageSettings" src={logo512} alt="Logo"></img>
        <div key={2} className="socialMediaPictures">
          {this.formatImages([
            { name: linkedin, url: linkedinUrl },
            { name: github, url: githubUrl },
            { name: instagram, url: instagramUrl },
            { name: facebook, url: facebookUrl }
          ])}
        </div>
      </div>
    );
  }
}

export default Settings;
