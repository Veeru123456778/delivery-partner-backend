const mongoose = require('mongoose');
const Location = require('./location'); // Import the Location model

const profileSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    locations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location', // Reference to the Location model
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);