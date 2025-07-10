const express = require("express");
const router = express.Router();
const {
  signupOrLogin,
  verifyOTP,
  get_delivery_partner_details,
  delete_delivery_partner_And_Profile,
} = require("../controllers/Auth");
const { auth, isDeliveryPartner } = require("../middleware/auth"); // Import isAdmin
const { saveWorkSetup,getWorkSetup } = require("../controllers/workSetupController");
const { upload } = require('../middleware/multer');
const { saveProfileSetup,getProfileSetup } = require("../controllers/profileSetupController");
const { saveDocuments,getDocuments,updateProfilePicture } = require("../controllers/documentsController");
const { getDeliveryPartnerInfo } = require("../controllers/deliveryPartner");

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

router.get("/get-delivery-partner-info", auth, isDeliveryPartner, getDeliveryPartnerInfo);

router.get('/get-work-setup', auth, isDeliveryPartner, getWorkSetup);

router.get("/get-profile-setup", auth, isDeliveryPartner, getProfileSetup);

router.get("/get-documents", auth, isDeliveryPartner, getDocuments);

router.put(
  "/update-profile-picture",
  auth,
  isDeliveryPartner,
  upload.single("userImage"),
  updateProfilePicture
);

// Protected route to get Delivery Partner details - now also requires vendor role
// router.get("/delivery-partner", auth, isDeliveryPartner, get_delivery_partner_details);

// Protected route to delete Delivery Partner  and profile - now also requires vendor role
// router.delete("/delivery-partner", auth, isDeliveryPartner, delete_delivery_partner_And_Profile);

module.exports = router;

