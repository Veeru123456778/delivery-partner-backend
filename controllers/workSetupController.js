
const DeliveryPartner = require('../models/delivery-partner/delivery-partner');
const WorkSetup = require('../models/workSetup/work_setup');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.saveWorkSetup = async (req, res) => {
  const userId = req.user.id;

  try {
    const {
      workCity,
      workArea,
      vehicleType,
      vehicleColor,
      manufacturing_year,
      vehicleNumber,
      workTimings,
    } = req.body;

    const rcImagePath = req.files['rcImage'][0].path;
    const insuranceImagePath = req.files['insuranceImg'][0].path;

    const rcUrl = await uploadToCloudinary(rcImagePath, 'rcImages');
    const insuranceUrl = await uploadToCloudinary(insuranceImagePath, 'insuranceImages');

    const workSetupDoc = await WorkSetup.create({
      work_city: workCity,
      work_area: workArea,
      vehicle_details: {
        vehicle_type: vehicleType,
        vehicle_color: vehicleColor,
        manufacturing_year: manufacturing_year,
        vehicle_number: vehicleNumber,
        registration_certificate_image: rcUrl,
        insurance_image: insuranceUrl,
      },
      preferred_work_timings: workTimings,
    });

    const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
      userId,
      { work_setup: workSetupDoc._id },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Work setup saved successfully',
      deliveryPartner,
    });
  } catch (error) {
    console.error('Error saving work setup:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};



exports.getWorkSetup = async (req, res) => {
  const userId = req.user.id;

  try {
    const deliveryPartner = await DeliveryPartner.findById(userId).populate('work_setup');

    if (!deliveryPartner || !deliveryPartner.work_setup) {
      return res.status(404).json({
        success: false,
        message: "Work setup not found for this delivery partner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Work setup fetched successfully",
      workSetup: deliveryPartner.work_setup,
    });
  } catch (error) {
    console.error("Error fetching work setup:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch work setup",
    });
  }
};