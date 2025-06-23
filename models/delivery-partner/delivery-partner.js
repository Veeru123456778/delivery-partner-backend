const mongoose = require('mongoose');

const deliveryPartnerSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['DeliveryPartner', 'Admin', 'User'],
    default: 'DeliveryPartner',
  },
  work_setup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkSetup',
    required: false,
  },
  profile_setup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProfileSetup',
    required: false,
  },
  documents: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Documents',
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('DeliveryPartner', deliveryPartnerSchema);
