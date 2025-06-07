const express = require('express');
const router = express.Router();
const { createLocation, getLocations, deleteLocation, updateLocation } = require('../controllers/location');
const { auth } = require('../middleware/auth');

// Create a new location for a profile
router.post('/:profileId', auth, createLocation);

// Get all locations for a profile
router.get('/:profileId', auth, getLocations);

// Update a location
router.put('/:locationId', auth, updateLocation);

// Delete a location
router.delete('/:locationId', auth, deleteLocation);

module.exports = router;