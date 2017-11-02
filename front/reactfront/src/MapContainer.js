import React, {Component} from 'react';
import {Map,InfoWindow,Marker,GoogleApiWrapper} from 'google-maps-react';
var GoogleApiKey = "AIzaSyClL7rwUwSndLBRBPpB7bnd-7B_IPNfMbk";
const style = {
  width: '60%',
  height: '60%'
}
export class MapContainer extends Component{
  render(){
    return (
      <Map
        google={this.props.google}
        style={style}
        initialCenter={{
          lat: 61.498020,
          lng: 23.761541
        }}
        zoom={15}
           >
      </Map>
    );
  }
}

export default GoogleApiWrapper({apiKey: (GoogleApiKey)})(MapContainer)
