const ProfileSetup = require("../models/profile/profile");
const DeliveryPartner = require("../models/delivery-partner/delivery-partner");

exports.saveProfileSetup = async (req, res) => {
  const userId = req.user.id;

  try {
    const { name, email, gender, bank_account_number, bank_name, name_of_account_holder,ifsc_code } = req.body;

    const profileData = {
      name,
      email,
      gender,
      bank_details: {
        bank_account_number,
        bank_name,
        name_of_account_holder,
        ifsc_code,
      },
    };

    const profile = await ProfileSetup.create(profileData);

    const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
        userId,
        { profile_setup: profile._id },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: 'Profile setup saved successfully',
        deliveryPartner,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save profile", error: err.message });
  }
};


exports.getProfileSetup = async (req, res) => {
  const userId = req.user.id;

  try {
    const deliveryPartner = await DeliveryPartner.findById(userId).populate('profile_setup');

    if (!deliveryPartner || !deliveryPartner.profile_setup) {
      return res.status(404).json({
        success: false,
        message: "Profile setup not found for this delivery partner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile setup fetched successfully",
      profile: deliveryPartner.profile_setup,
    });
  } catch (error) {
    console.error("Error fetching profile setup:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile setup",
    });
  }
};
