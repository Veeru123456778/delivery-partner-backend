const express = require("express");
const router = express.Router();
const {
  signupOrLogin,
  verifyOTP,
  get_delivery_partner_details,
  delete_delivery_partner_And_Profile,
} = require("../controllers/Auth");
const { auth, isDeliveryPartner } = require("../middleware/auth"); // Import isAdmin

// Unified route for signup and login
router.post("/send-otp", signupOrLogin);

// Route to verify OTP for signup or login
router.post("/verify-otp", verifyOTP);

// Protected route to get vendor details - now also requires vendor role
router.get("/delivery-partner", auth, isDeliveryPartner, get_delivery_partner_details);

// Protected route to delete vendor and profile - now also requires vendor role
router.delete("/delivery-partner", auth, isDeliveryPartner, delete_delivery_partner_And_Profile);

module.exports = router;

