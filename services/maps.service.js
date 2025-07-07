// Example implementation of getAddressCoordinates
const axios = require('axios'); // Use axios for HTTP requests


async function getAddressCoordinates(address) {
    if (!address || typeof address !== 'string') {
        throw new Error('Invalid address provided.');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Replace with your geocoding API key
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);

        if (response.data.status !== 'OK') {
            throw new Error(`Geocoding API error: ${response.data.status}`);
        }

        const location = response.data.results[0].geometry.location;
        return {
            latitude: location.lat,
            longitude: location.lng,
        };
    } catch (error) {
        throw new Error(`Failed to fetch coordinates: ${error.message}`);
    }
}

async function getDistanceAndTime(origin, destination) {
  if(!origin || !destination) {
    throw new Error('Origin and destination are required.');
  }
    const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Replace with your Google Maps API key
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
    try {
            const response = await axios.get(apiUrl);
    
            if (response.data.status !== 'OK') {
                throw new Error(`Distance Matrix API error: ${response.data.status}`);
            }
    
            const element = response.data.rows[0].elements[0];
            if (element.status !== 'OK') {
                throw new Error(`Element status error: ${element.status}`);
            }
    
            return {
                distance: element.distance.text,
                duration: element.duration.text,
            };
        } catch (error) {
            throw new Error(`Failed to fetch distance and time: ${error.message}`);
        }
}

module.exports = {getAddressCoordinates,getDistanceAndTime};