import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import logo from './images/stop.svg';
import gif from './images/giphy.gif';
import './App.css';
import MapContainer from './MapContainer.js';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-top"></div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title1">Traffic </h1>
          <h1 className="App-title2">Light </h1>
          <h1 className="App-title3">Application</h1>
        </header>
        <div className="App-submits">

        <form>
          <br/>
          <label>

            <input className="form-control" type="text" placeholder="Mistä" id="example-text-input"/>
          </label>
          <input type="button" value="Submit" className="submitButton btn-primary btn-lg"/>
          <br/>
          <label>

            <input className="form-control" type="text" placeholder="Mihin" id="example-text-input"/>
          </label>

        </form>
        </div>
        <div className="App-results">
          <div className="result">
            <p className="resultRoute">From -mist- to -mihi-</p>

          </div>
        </div>
        <div className="App-map-container" alt="map-container"><MapContainer/></div>
        <div className="App-bot"></div>
      </div>
    );
  }
}

export default App;
