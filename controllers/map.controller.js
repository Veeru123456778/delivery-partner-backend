const { getAddressCoordinates,getDistanceAndTime } = require('../services/maps.service');

module.exports.getCoordinates = async (req, res) => {
    try {
        const coordinates = await getAddressCoordinates(req.query.address);
        return res.status(200).json({
            success: true,
            message: "Coordinates fetched successfully",
            coordinates
        });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Coordinates not found",
            error: error.message
        });
    }
}


module.exports.getDistanceTime = async (req, res) => {
    try {
        const { origin, destination } = req.query;
        if (!origin || !destination) {
            return res.status(400).json({
                success: false,
                message: "Origin and destination are required"
            });
        }

        // Assuming you have a service function to calculate distance and time
        const distanceTime = await getDistanceAndTime(origin, destination);
        
        return res.status(200).json({
            success: true,
            message: "Distance and time fetched successfully",
            data: distanceTime
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching distance and time",
            error: error.message
        });
    }
};