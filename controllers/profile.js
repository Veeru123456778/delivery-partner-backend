const Profile = require('../models/profile/profile');

// Get a profile by ID
exports.getProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const profile = await Profile.findById(id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }

        return res.status(200).json({ success: true, profile });
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch profile' });
    }
};

// Update a profile by ID
exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { email, name, image } = req.body;

    try {
        const profile = await Profile.findByIdAndUpdate(
            id,
            { email, name, image },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        return res.status(200).json({ success: true, message: 'Profile updated successfully', profile });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

// Delete a profile by ID
exports.deleteProfile = async (req, res) => {
    const { id } = req.params;

    try {
        const profile = await Profile.findByIdAndDelete(id);

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        return res.status(200).json({ success: true, message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        return res.status(500).json({ success: false, message: 'Failed to delete profile' });
    }
};