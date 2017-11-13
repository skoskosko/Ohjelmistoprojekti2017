import React, { Component } from 'react';
import logo from './images/stop.svg';
import gif from './images/giphy.gif';
import './App.css';
import MapContainer from './MapContainer.js';


class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Traffic Light Application</h1>
        </header>
        <div className="App-submits">
        <form>
          <br/>
          <br/>
          <label>
            Mistä:
            <input type="text" name="mist" className="inputField"/>
          </label>
          <input type="submit" value="Submit" className="submitButton"/>
          <br/>
          <br/>
          <label>
            Mihin:
            <input type="text" name="mihi" className="inputField"/>
          </label>

        </form>
        </div>
        <div className="App-results"></div>
        <div className="App-map-container" alt="map-container"><MapContainer/></div>
      </div>
    );
  }
}

export default App;
