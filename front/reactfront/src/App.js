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
        <p className="App-intro">
          Tässä meillä hieno etusivu<br/><br/><br/><br/>
        </p>
        <img src={gif} className="App-gif" alt="gif"/>
        <div className="App-map-container" alt="map-container"><MapContainer/></div>
      </div>
    );
  }
}

export default App;
