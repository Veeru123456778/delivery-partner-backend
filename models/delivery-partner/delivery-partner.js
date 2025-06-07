const mongoose = require('mongoose');

const Delivery_Partner_Schema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/, // Ensures a 10-digit mobile number
    },
    isVerified: {
      type: Boolean,
      default: false, // Indicates whether the mobile number is verified
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // Reference to the Profile model
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin","DeliveryPartner"], // Allowed roles
      default: "DeliveryPartner", // Default role is 'vendor'
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("DeliveryPartner", Delivery_Partner_Schema);