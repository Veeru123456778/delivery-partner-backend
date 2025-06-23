const jwt = require("jsonwebtoken");
const DeliveryPartner = require("../models/delivery-partner/delivery-partner");
const Profile = require("../models/profile/profile");
const MobileOTP = require("../models/MobileOTP");
require("dotenv").config();

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Generate Token
function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" } // Token expires in 24 hours
  );
}

// Unified Signup/Login Route
exports.signupOrLogin = async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber || !/^[0-9]{10}$/.test(mobileNumber)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid mobile number" });
  }

  try {
    // Check if the delivery_partner exists
    const delivery_partner = await DeliveryPartner.findOne({ mobileNumber });

    // Generate OTP
    const otp = generateOTP();
     console.log("Generated OTP:", otp);
    // Save OTP to the database
    await MobileOTP.create({ mobileNumber, otp });

    if (delivery_partner) {
      // Login process
      return res.status(200).json({
        success: true,
        message: "Login OTP sent successfully",
        isSignup: false,
      });
    } else {
      // Signup process
      return res.status(200).json({
        success: true,
        message: "Signup OTP sent successfully",
        isSignup: true,
      });
    }
  } catch (error) {
    console.error("Error in signupOrLogin:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to process request" });
  }
};

// Verify OTP for Signup/Login
// exports.verifyOTP = async (req, res) => {
//   const { mobileNumber, otp } = req.body;

//   if (!mobileNumber || !otp) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Mobile number and OTP are required" });
//   }

//   try {
//     // Find the most recent OTP for this mobile number
//     const recentOtp = await MobileOTP.find({ mobileNumber })
//       .sort({ createdAt: -1 })
//       .limit(1);

//     if (!recentOtp.length || otp !== recentOtp[0].otp) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid OTP",
//       });
//     }

//     // OTP is valid, delete all OTPs for this number
//     await MobileOTP.deleteMany({ mobileNumber });

//     // Check if the delivery_partner exists
//     let delivery_partner = await DeliveryPartner.findOne({ mobileNumber });

//     if (!delivery_partner) {
//       // Signup process: Create a new delivery_partner and profile
//       const profile = await Profile.create({
//         email: null,
//         name: "Anonymous",
//         gender:null,
//         image: null,
//       });

//       delivery_partner = await DeliveryPartner.create({
//         mobileNumber,
//         isVerified: true,
//         profile: profile._id,
//       });
//     } else {
//       // Login process: Update verification status
//       delivery_partner.isVerified = true;
//       await delivery_partner.save();
//     }

//     // Generate token
//     const token = generateToken(delivery_partner);

//     // Set token in cookies
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 5 * 60 * 60 * 1000, // 5 hours
//     });

//     return res.status(200).json({
//       success: true,
//       message: delivery_partner.isNew ? "Signup successful" : "Login successful",
//       token,
//       delivery_partner,
//     });
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Failed to verify OTP" });
//   }
// };


// Verify OTP for Signup/Login
exports.verifyOTP = async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Mobile number and OTP are required" });
  }

  try {
    // Find the most recent OTP for this mobile number
    const recentOtp = await MobileOTP.find({ mobileNumber })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!recentOtp.length || otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP is valid, delete all OTPs for this number
    await MobileOTP.deleteMany({ mobileNumber });

    // Check if the delivery_partner exists
    let delivery_partner = await DeliveryPartner.findOne({ mobileNumber });

    if (!delivery_partner) {
      // Signup process: Create a new delivery_partner WITHOUT profile
      delivery_partner = await DeliveryPartner.create({
        mobileNumber,
        isVerified: true,
        // All other fields (profile, bank_details, etc.) remain undefined/null
      });
    } else {
      // Login process: Update verification status
      delivery_partner.isVerified = true;
      await delivery_partner.save();
    }

    // Generate token
    const token = generateToken(delivery_partner);

    // Set token in cookies
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 5 * 60 * 60 * 1000, // 5 hours
    });

    return res.status(200).json({
      success: true,
      message: delivery_partner.isNew ? "Signup successful" : "Login successful",
      token,
      delivery_partner,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to verify OTP" });
  }
};


exports.get_delivery_partner_details = async (req, res) => {
  try {
    const delivery_partnerId = req.user.id; // Extract delivery_partner ID from the token (set by auth middleware)

    // Find the delivery_partner and populate the connected profile
    const delivery_partner = await DeliveryPartner.findById(delivery_partnerId).populate("profile");
    if (!delivery_partner) {
      return res
        .status(404)
        .json({ success: false, message: "delivery_partner not found" });
    }

    return res.status(200).json({ success: true, delivery_partner });
  } catch (error) {
    console.error("Error fetching delivery_partner details:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch delivery_partner details" });
  }
};

exports.delete_delivery_partner_And_Profile = async (req, res) => {
  try {
    const delivery_partnerId = req.user.id; // Extract delivery_partner ID from the token (set by auth middleware)
    console.log("delivery_partner ID:", delivery_partnerId);

    // Find the delivery_partner
    const delivery_partner = await DeliveryPartner.findById(delivery_partnerId);
    if (!delivery_partner) {
      console.log("delivery_partner not found");
      return res
        .status(404)
        .json({ success: false, message: "delivery_partner not found" });
    }
    console.log("delivery_partner found:", delivery_partner);

    // Find the profile associated with the delivery_partner
    const profile = await Profile.findById(delivery_partner.profile).exec(); // Ensure it's a Mongoose document
    if (profile) {
      console.log("Profile found:", profile);

      // Delete locations associated with the profile
      const Location = require("../models/profile/location"); // Import the Location model
      const result = await Location.deleteMany({ profile: profile._id });
      console.log("Locations deleted:", result);

      // Delete the profile
      await Profile.findByIdAndDelete(profile._id);
      console.log("Profile deleted");
    } else {
      console.log("Profile not found");
    }

    // Delete the delivery_partner
    await delivery_partner.findByIdAndDelete(delivery_partnerId);
    console.log("delivery_partner deleted");

    return res.status(200).json({
      success: true,
      message: "delivery_partner, profile, and associated locations deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting delivery_partner, profile, and locations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete delivery_partner, profile, and locations",
    });
  }
};
