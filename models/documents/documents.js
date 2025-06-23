const mongoose = require('mongoose');

const documentsSchema = new mongoose.Schema({
  user_image: { type: String, required: true },
  aadhar_details: {
    number: { type: String, required: true },
  },
  pan_details: {
    number: { type: String, required: true },
  },
});

module.exports = mongoose.model('Documents', documentsSchema);
