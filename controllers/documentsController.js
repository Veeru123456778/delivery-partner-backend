const Documents = require("../models/documents/documents");
const DeliveryPartner = require("../models/delivery-partner/delivery-partner");
const { uploadToCloudinary } = require("../utils/cloudinary");

exports.saveDocuments = async (req, res) => {
  const userId = req.user.id;

  try {
    const { aadharNumber, panNumber } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "User image is required" });
    }

    const user_image_url = await uploadToCloudinary(file.path);

    const document = await Documents.create({
      user_image: user_image_url,
      aadhar_details: { number: aadharNumber },
      pan_details: { number: panNumber },
    });

    const deliveryPartner = await DeliveryPartner.findByIdAndUpdate(
        userId,
        { documents: document._id },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: 'Documents saved successfully',
        deliveryPartner,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save documents", error: err.message });
  }
};
