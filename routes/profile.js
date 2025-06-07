const express = require('express');
const router = express.Router();
const { auth, isDeliveryPartner } = require('../middleware/auth');
const {
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
} = require('../controllers/profile');

// Route to get a profile by ID (only authenticated users)
router.get('/:id', auth, isDeliveryPartner, getProfile);

// Route to update a profile by ID (only authenticated users)
router.put('/:id', auth, isDeliveryPartner, updateProfile);

// Route to delete a profile by ID (only authenticated users)
router.delete('/:id', auth, isDeliveryPartner, deleteProfile);

module.exports = router;