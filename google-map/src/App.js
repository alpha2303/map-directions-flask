
import React from 'react';

import './index.css';

export default class App extends React.Component

{

  constructor() {
    super();
    this.state = {
      zoom: 13,
      maptype: 'roadmap',
      place_formatted: '',
  place_id: '',
  place_location: '',
    }

  }

  componentDidMount() {
       let map = new window.google.maps.Map(document.getElementById('map'), {
         center: {lat: 41.85, lng: -87.65},
         zoom: 13,
         mapTypeId: 'roadmap',
       });

       map.addListener('zoom_changed', () => {
  this.setState({
    zoom: map.getZoom(),
  });
});

map.addListener('maptypeid_changed', () => {
  this.setState({
    maptype: map.getMapTypeId(),
  });
});

let marker = new window.google.maps.Marker({
  map: map,
  position: {lat: -33.8688, lng: 151.2195},
});

let startNode = document.getElementById('pac-start');


let endNode=document.getElementById('pac-end');

map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(startNode);
map.controls[window.google.maps.ControlPosition.TOP_CENTER].push(endNode);


let autoComplete1 = new window.google.maps.places.Autocomplete(startNode);
let autoComplete2 = new window.google.maps.places.Autocomplete(endNode);

autoComplete1.addListener('place_changed', () => {
  let place = autoComplete1.getPlace();
  let location = place.geometry.location;
  this.setState({
      place_formatted: place.formatted_address,
      place_id: place.place_id,
      place_location: location.toString(),
    });
    // bring the selected place in view on the map
    map.fitBounds(place.geometry.viewport);
    map.setCenter(location);

    marker.setPlace({
      placeId: place.place_id,
      location: location,
    });
  });

var directionsService = new window.google.maps.DirectionsService;
var directionsDisplay = new window.google.maps.DirectionsRenderer;


directionsDisplay.setMap(map);
directionsDisplay.setPanel(document.getElementById('right-panel'));

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  let selectedMode = document.getElementById('mode').value;
        directionsService.route({
          origin: document.getElementById('pac-start').value,
          destination: document.getElementById('pac-end').value,
          travelMode: window.google.maps.TravelMode[selectedMode]

        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });

   }

        var onChangeHandler = function() {
            calculateAndDisplayRoute(directionsService, directionsDisplay);
        }

        document.getElementById('pac-start').addEventListener('change', onChangeHandler);
        document.getElementById('pac-end').addEventListener('change', onChangeHandler);
        document.getElementById('mode').addEventListener('change', onChangeHandler);
      }



  // bring the selected place in view on the map

     render() {
       return (
         <div id='app'>
         <div id='right-panel'/>
         <div id="floating-panel">
    <b>Mode of Travel: </b>
    <select id='mode'>
      <option value="DRIVING">Driving</option>
      <option value="WALKING">Walking</option>
      <option value="BICYCLING">Bicycling</option>
      <option value="TRANSIT">Transit</option>
    </select>
    </div>
           <div id='map'/>

             <input id='pac-start' type='text' placeholder='Enter Starting point' />
             <input id='pac-end' type='text' placeholder='Enter destination' />



         </div>

       );
     }
};
