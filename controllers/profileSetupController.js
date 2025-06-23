const ProfileSetup = require("../models/profile/profile");
const DeliveryPartner = require("../models/delivery-partner/delivery-partner");

exports.saveProfileSetup = async (req, res) => {
  const userId = req.user.id;

  try {
    const { name, email, gender, bank_account_number, bank_name, name_of_account_holder } = req.body;

    const profileData = {
      name,
      email,
      gender,
      bank_details: {
        bank_account_number,
        bank_name,
        name_of_account_holder,
      },
    };

    const profile = await ProfileSetup.create(profileData);

    // const deliveryPartner = await DeliveryPartner.findById(userId);
    // deliveryPartner.profile = profile._id;
    // await deliveryPartner.save();

    // res.status(200).json({ success: true, message: "Profile saved", profile });

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
