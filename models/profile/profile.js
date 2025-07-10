const mongoose = require('mongoose');

const profileSetupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String},
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true,
  },
  bank_details: {
    bank_account_number: { type: String, required: true },
    bank_name: { type: String, required: true },
    name_of_account_holder: { type: String, required: true },
    ifsc_code: { type: String, required: true },
  },
});

module.exports = mongoose.model('ProfileSetup', profileSetupSchema);
