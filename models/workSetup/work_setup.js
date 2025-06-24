const mongoose = require('mongoose');

const workSetupSchema = new mongoose.Schema({
  work_city: { type: String, required: true },
  work_area: { type: String, required: true },

  vehicle_details: {
    vehicle_type: {
      type: String,
      enum: ['Bike', 'Car', 'Scooty'],
      required: true,
    },
    vehicle_color: { type: String, required: true },
    manufacturing_year: { type: String, required: true },
    vehicle_number: { type: String, required: true },
    registration_certificate_image: { type: String, required: true },
    insurance_image: { type: String, required: true },
  },
  preferred_work_timings: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('WorkSetup', workSetupSchema);
