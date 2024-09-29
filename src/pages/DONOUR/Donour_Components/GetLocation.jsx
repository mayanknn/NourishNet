// src/Geolocation.jsx

import React, { useState } from 'react';

const Geolocation = () => {
  const [location, setLocation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const loc = `Latitude: ${latitude}, Longitude: ${longitude}`;
          
          setLocation(loc);
          console.log(loc); // Print the location in the console
          setErrorMessage('');
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setErrorMessage("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setErrorMessage("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setErrorMessage("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              setErrorMessage("An unknown error occurred.");
              break;
            default:
              setErrorMessage("An unexpected error occurred.");
          }
          setLocation('');
        }
      );
    } else {
      setErrorMessage("Geolocation is not supported by this browser.");
      setLocation('');
    }
  };

  return (
    <div>
      <h1>Your Current Location</h1>
      <button onClick={getLocation}>Get Location</button>
      <p>{location || errorMessage}</p>
    </div>
  );
};

export default Geolocation;
