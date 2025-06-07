const Location = require('../models/profile/location');
const Profile = require('../models/profile/profile');

// Create a new location for a profile
exports.createLocation = async (req, res) => {
    try {
        const { profileId } = req.params;
        const { latitude, longitude, locationName, city, state, country, pincode, address } = req.body;

        // Find the profile
        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        // Create the location
        const location = await Location.create({
            latitude,
            longitude,
            locationName,
            city,
            state,
            country,
            pincode,
            address,
            profile: profileId,
        });

        // Add the location to the profile
        profile.locations.push(location._id);
        await profile.save();

        return res.status(201).json({ success: true, location });
    } catch (error) {
        console.error('Error creating location:', error);
        return res.status(500).json({ success: false, message: 'Failed to create location' });
    }
};

// Get all locations for a profile
exports.getLocations = async (req, res) => {
    try {
        const { profileId } = req.params;

        // Find the profile and populate locations
        const profile = await Profile.findById(profileId).populate('locations');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        return res.status(200).json({ success: true, locations: profile.locations });
    } catch (error) {
        console.error('Error fetching locations:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch locations' });
    }
};

// Delete a location
exports.deleteLocation = async (req, res) => {
    try {
        const { locationId } = req.params;

        // Find and delete the location
        const location = await Location.findByIdAndDelete(locationId);
        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        // Remove the location from the profile
        const profile = await Profile.findById(location.profile);
        if (profile) {
            profile.locations = profile.locations.filter(loc => loc.toString() !== locationId);
            await profile.save();
        }

        return res.status(200).json({ success: true, message: 'Location deleted successfully' });
    } catch (error) {
        console.error('Error deleting location:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete location' });
    }
};

// Update a location
exports.updateLocation = async (req, res) => {
    try {
        const { locationId } = req.params;
        const { latitude, longitude, locationName, city, state, country, pincode, address } = req.body;

        // Find and update the location
        const location = await Location.findByIdAndUpdate(
            locationId,
            { latitude, longitude, locationName, city, state, country, pincode, address },
            { new: true } // Return the updated document
        );

        if (!location) {
            return res.status(404).json({ success: false, message: 'Location not found' });
        }

        return res.status(200).json({ success: true, message: 'Location updated successfully', location });
    } catch (error) {
        console.error('Error updating location:', error);
        return res.status(500).json({ success: false, message: 'Failed to update location' });
    }
};