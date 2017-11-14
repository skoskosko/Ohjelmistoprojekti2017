import React, {Component} from 'react';
import {Map,GoogleApiWrapper,Marker} from 'google-maps-react'; // InfoWindow,Marker otettu pois importeista compile errorin takia
import Axios from 'axios';
var GoogleApiKey = "AIzaSyClL7rwUwSndLBRBPpB7bnd-7B_IPNfMbk";
//https://github.com/fullstackreact/google-maps-react
const style = {
  width: '100%',
  height: '100%'
}
/*
  */
  function haeData(){



  }
var markers=[];
var arr=[];

export class MapContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      arr:[]
    }
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
  else if(this.state.arr[0] != undefined){
    var lights = this.state.arr;
    for(var i in lights){
      var lat = lights[i].coordinates[1];
      var lng = lights[i].coordinates[0];
      var device = lights[i].device;
      var id = lights[i]._id;
      markers.push(<Marker
                    key={id}
                    position={{lat:lat,lng:lng}}
                    title={device}
                    name={device}/>)
    }
  }
}

componentWillMount(){
  console.log("Will mount");
}
componentDidMount(){
  console.log("Did mount")
  Axios.get('http://localhost:3000/lights')
  .then(response =>{

    this.setState({
      arr: response.data
    })

  })
}
  mapClicked(mapProps,map,clickEvent){
    var lat=clickEvent.latLng.lat();
    var lng=clickEvent.latLng.lng();
    console.log(lat);
    console.log(lng);
  }
  render(){
    console.log("Render")
    console.log(markers)
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
      </Map>
    );
  }
}

export default GoogleApiWrapper({apiKey: (GoogleApiKey)})(MapContainer)

//https://maps.googleapis.com/maps/api/directions/json?origin=Hervanta,Tampere&destination=Sokos,Tampere&waypoints=Rautatieasema,Tampere&key=AIzaSyClL7rwUwSndLBRBPpB7bnd-7B_IPNfMbk
