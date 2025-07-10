const Documents = require("../models/documents/documents");
const DeliveryPartner = require("../models/delivery-partner/delivery-partner");
const { uploadToCloudinary,deleteFromCloudinary } = require("../utils/cloudinary");

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



exports.getDocuments = async (req, res) => {
  const userId = req.user.id;

  try {
    const deliveryPartner = await DeliveryPartner.findById(userId).populate("documents");

    if (!deliveryPartner || !deliveryPartner.documents) {
      return res.status(404).json({
        success: false,
        message: "Documents not found for this delivery partner",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Documents fetched successfully",
      documents: deliveryPartner.documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch documents",
    });
  }
};



exports.updateProfilePicture = async (req, res) => {
  const userId = req.user.id;

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Profile picture is required" });
    }

    // Find the delivery partner and populate the documents field
    const deliveryPartner = await DeliveryPartner.findById(userId).populate("documents");

    if (!deliveryPartner || !deliveryPartner.documents) {
      return res.status(404).json({ success: false, message: "Documents not found for this delivery partner" });
    }

    const documents = deliveryPartner.documents;

    // Delete the old profile picture from Cloudinary
    if (documents.user_image) {
      const oldImagePublicId = documents.user_image.split("/").pop().split(".")[0]; // Extract public ID
      await deleteFromCloudinary(oldImagePublicId); // Assuming delete function exists in your Cloudinary utility
    }

    // Upload the new profile picture to Cloudinary
    const newProfileImageUrl = await uploadToCloudinary(file.path);

    // Update the documents with the new profile picture URL
    documents.user_image = newProfileImageUrl;
    await documents.save();

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profileImage: newProfileImageUrl,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile picture",
      error: error.message,
    });
  }
};