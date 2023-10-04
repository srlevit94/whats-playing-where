import React from 'react'
import DisplayNearbyCinemas from './DisplayNearbyCinemas';

import axios from 'axios'


const clientName = process.env.REACT_APP_CLIENT_NAME;
const xApiKey = process.env.REACT_APP_X_API_KEY;
const apiVersion = process.env.REACT_APP_API_VERSION;
const territory = process.env.REACT_APP_TERRITORY;  
const apiKey = process.env.REACT_APP_API_KEY; 

const zipTocoords = async (zipcode) => {
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const googleMapsApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

    try {
        const response = await fetch(googleMapsApiUrl);
        const data = await response.json();
    
        if (data.status === 'OK' && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          const latitude = location.lat;
          const longitude = location.lng;
          return { latitude, longitude };
        } else {
          throw new Error('ZIP code not found or API error.');
        }
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
};


const getNearbyTheaters = (latitiude, longitude) => {
    const headers = {
        headers: {
            clientName: 'REACT_APP_CLIENT_NAME',
            authorization: 'REACT_APP_API_KEY',
            xApiKey: 'REACT_APP_X_API_KEY',
            apiVersion: 'REACT_APP_API_VERSION',
            geolocation: `${latitiude};${longitude}`,
        }
    }
    axios
    .get('https://api-gate2.movieglu.com/cinemasNearby/?n=10', headers)
    .then (res => {
        this.setState({ nearbyTheaters: res.data.cinemas })
    })
    .catch(err => console.log(err))
}


const InputZipCode = () => {
    return (
    <div>
    <div class="first-screen grab-location-wrapper">
        <form action="" class="">
            <legend class="">Enter ZIP code to see nearby theaters</legend>
            <input type="text" class="" placeholder="Enter your Zip Code"/>
            <button type="submit" class="">Submit</button>
        </form>
    </div>
    <div class="zipcodes-container">
        <ul class="searched-zipcodes-list">
        
        </ul>
    </div>
    <DisplayNearbyCinemas />
    </div>
    );
};

export default InputZipCode;
