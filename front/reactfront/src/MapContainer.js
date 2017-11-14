import React, {Component} from 'react';
import {Map,GoogleApiWrapper,Marker,InfoWindow} from 'google-maps-react';
import Axios from 'axios';
var GoogleApiKey = "AIzaSyClL7rwUwSndLBRBPpB7bnd-7B_IPNfMbk";
//https://github.com/fullstackreact/google-maps-react
//http://maps.google.com/mapfiles/ms/icons/yellow-dot.png keltanen markkeri
//http://maps.google.com/mapfiles/ms/icons/green-dot.png vihree markkeri
const style = {
  width: '100%',
  height: '100%'
}
var markers=[];

export class MapContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      arr:[],
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      avgWaitTime: {},
      vehicleCount: {}
    }
    this.markerClicked = this.markerClicked.bind(this);
    this.mapClicked = this.mapClicked.bind(this);
  }
componentDidUpdate(prevProps,prevState){
  if(prevState.arr === this.state.arr){
    console.log(prevProps.loaded)
    console.log(this.props.loaded)
    console.log(prevState.arr)
    console.log(this.state.arr)
    console.log("Jaa samat")

  }
  else{
    this.setState(this.state);
    console.log("Jaa ei ollukkaa")
  }
console.log("Did update");



}
componentWillUpdate(){
  console.log("Will update");
  if(this.state.arr[0] === undefined){
    console.log("Willupdate undefined")
  }
  else if(this.state.arr[0] !== undefined){
    var lights = this.state.arr;
    markers = [];
    for(var i in lights){
      var lat = lights[i].coordinates[1];
      var lng = lights[i].coordinates[0];
      var device = lights[i].device;
      var id =lights[i]._id;
      var hostid =lights[i].hostId;
      var avgWaitTime = lights[i].avgWaitTime;
      var vehicleCount = lights[i].vehicleCount;
    
      markers.push(<Marker
                    key={id}
                    position={{lat:lat,lng:lng}}
                    title={device}
                    name={hostid}
                    onClick={this.markerClicked}
                  />)
    }
    console.log(markers)
  }
}

componentWillMount(){
  console.log("Will mount");
}
componentDidMount(){
  console.log("Did mount")
  Axios.get('http://takku.eu:3001/congestion')
  .then(response =>{
console.log(response)
    this.setState({
      arr: response.data
    })

  })
}
markerClicked(props,marker,e){
  console.log(props)
  console.log(marker)
  console.log(e)
  console.log(markers)

this.setState({
  selectedPlace: props,
  activeMarker: marker,
  showingInfoWindow: true
})
}
  mapClicked(mapProps,map,clickEvent){
    if(this.state.showingInfoWindow){
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
    var lat=clickEvent.latLng.lat();
    var lng=clickEvent.latLng.lng();
    console.log(lat);
    console.log(lng);
  }
  render(){
    console.log("Render")
    console.log(markers)
    console.log(this.state.selectedPlace.position)

    return (
      <Map
        google={this.props.google}
        style={style}
        initialCenter={{
          lat: 61.498020,
          lng: 23.761541
        }}
        zoom={15}
        onClick={this.mapClicked}
           >
{markers}
<InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}>
            <div>
              <h1>{this.state.selectedPlace.title}</h1>
              <div>
                <ul>
                  <li>id: {this.state.selectedPlace.name}</li>
                  <li>avg: </li>
                  <li>count: </li>
                </ul>
              </div>
            </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({apiKey: (GoogleApiKey)})(MapContainer)

//https://maps.googleapis.com/maps/api/directions/json?origin=Hervanta,Tampere&destination=Sokos,Tampere&waypoints=Rautatieasema,Tampere&key=AIzaSyClL7rwUwSndLBRBPpB7bnd-7B_IPNfMbk
