import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

export default class MapContainer extends Component {

  // ======================
  // ADD LOCATIONS TO STATE
  // ======================
  
 state = {
    location: [
      /*{ name: "New York County Supreme Court", location: {lat: 40.7143033, lng: -74.0036919} },
      { name: "Queens County Supreme Court", location: {lat: 40.7046946, lng: -73.8091145} },
      { name: "Kings County Supreme Court", location: {lat: 40.6940226, lng: -73.9890967} },
      { name: "Richmond County Supreme Court", location: {lat: 40.6412336, lng: -74.0768597} },
      { name: "Bronx Supreme Court", location: {lat: 40.8262388, lng: -73.9235238} }*/
    ]
  }
 
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.google !== this.props.google || prevProps.locations !== this.props.locations) {
      this.loadMap();
      this.fetchData();
    }
  }

  /*componentDidUpdate() {
      setInterval(this.loadMap(),60000); // call loadMap function to load the google map
  }*/


//This function fetches data from backend and stores in state object
  fetchData() {
    axios.get('http://+ backend+:3001/')
      .then( (response) => {
        console.log("response", parseFloat(response));
        const location =response.data;
        this.setState({ location });
      })
      .catch( (error) => {
        console.log(error);
      });
  }


//This function will be called initially
componentWillMount(){
    this.fetchData()
  }

  loadMap() {
   // this.fetchData();
    if (this.props && this.props.google) { // checks to make sure that props have been passed
      const {google} = this.props; // sets props equal to google
      const maps = google.maps; // sets maps to google maps props

      const mapRef = this.refs.map; // looks for HTML div ref 'map'. Returned in render below.
      const node = ReactDOM.findDOMNode(mapRef); // finds the 'map' div in the React DOM, names it node

      const mapConfig = Object.assign({}, {
        center: {lat: 61.497978, lng: 23.764931}, // sets center of google map to Tampere City.
        zoom: 11, // sets zoom. Lower numbers are zoomed further out.
        mapTypeId: 'roadmap' // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      })

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.

  // ==================
  // ADD MARKERS TO MAP
  // ==================
      this.state.location.forEach( location => { // iterate through locations saved in state
        const marker = new google.maps.Marker({ // creates a new Google maps Marker object.
          position: {lat: parseFloat(location.latitude.value), lng: parseFloat(location.longitude.value)}, // sets position of marker to specified location
          map: this.map, // sets markers to appear on the map we just created on line 35
          title: location.id // the title of the marker is set to the name of the location
        });

         var infowindow = new google.maps.InfoWindow({
          content: `<h3>ID: ${location.id}</h3>
                    <h4>Humidity: ${location.humidity.value}</h4>
                    <h4>Temperature: ${location.temperature.value}</h4>`
        });
          marker.addListener('click', function() {
          infowindow.open(this.map, marker);
        });

      })



     
    }
  }

  render() {
    const style = { // MUST specify dimensions of the Google map or it will not work. Also works best when style is specified inside the render function and created as an object
      width: '100vw', // 100vw basically means take up 90% of the width screen. px also works.
      height: '75vh' // 75vh similarly will take up roughly 75% of the height of the screen. px also works.
    }

    return ( // in our return function you must return a div with ref='map' and style.
      <div ref="map" style={style}>
        loading map...
      </div>
    )
  }
}
