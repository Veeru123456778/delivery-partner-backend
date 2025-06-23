const express = require("express");
const router = express.Router();
const {
  signupOrLogin,
  verifyOTP,
  get_delivery_partner_details,
  delete_delivery_partner_And_Profile,
} = require("../controllers/Auth");
const { auth, isDeliveryPartner } = require("../middleware/auth"); // Import isAdmin
const { saveWorkSetup } = require("../controllers/workSetupController");
const { upload } = require('../middleware/multer');
const { saveProfileSetup } = require("../controllers/profileSetupController");
const { saveDocuments } = require("../controllers/documentsController");

// Unified route for signup and login
router.post("/send-otp", signupOrLogin);

// Route to verify OTP for signup or login
router.post("/verify-otp", verifyOTP);


router.post(
  "/work-setup",
  auth,
  isDeliveryPartner,
  upload.fields([
    { name: 'rcImage', maxCount: 1 },
    { name: 'insuranceImg', maxCount: 1 },
  ]),
  saveWorkSetup
);

router.post("/profile-setup", auth, isDeliveryPartner, saveProfileSetup);


router.post(
  "/documents-upload",
  auth,
  isDeliveryPartner,
  upload.single("userImage"),
  saveDocuments
);


// Protected route to get Delivery Partner details - now also requires vendor role
router.get("/delivery-partner", auth, isDeliveryPartner, get_delivery_partner_details);

// Protected route to delete Delivery Partner  and profile - now also requires vendor role
router.delete("/delivery-partner", auth, isDeliveryPartner, delete_delivery_partner_And_Profile);

module.exports = router;

