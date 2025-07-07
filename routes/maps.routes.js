const express = require('express');
const router = express.Router();

const { getCoordinates,getDistanceTime } = require('../controllers/map.controller');
const { auth } = require('../middleware/auth');

// Route to get address coordinates
router.get('/get-coordinates', auth, getCoordinates);

router.get('/get-distance-time',auth,getDistanceTime);

module.exports = router;
