const DeliveryPartner = require("../models/delivery-partner/delivery-partner");

exports.getDeliveryPartnerInfo = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch the delivery partner and populate related fields
    const deliveryPartner = await DeliveryPartner.findById(userId)
      .populate("profile_setup")
      .populate("work_setup")
      .populate("documents");

    if (!deliveryPartner) {
      return res.status(404).json({
        success: false,
        message: "Delivery partner not found",
      });
    }

    // Extract required fields
    const profile = deliveryPartner.profile_setup || {};
    const workSetup = deliveryPartner.work_setup || {};
    const documents = deliveryPartner.documents || {};

    const response = {
      name: profile.name || null,
      email: profile.email || null,
      contact: deliveryPartner.mobileNumber || null,
      profileImage: documents.user_image || null,
      vehicleType: workSetup.vehicle_details?.vehicle_type || null,
      vehicleColor: workSetup.vehicle_details?.vehicle_color || null,
      manufacturingYear: workSetup.vehicle_details?.manufacturing_year || null,
      vehicleNumber: workSetup.vehicle_details?.vehicle_number || null,
      accountNumber: profile.bank_details?.bank_account_number || null,
      bankName: profile.bank_details?.bank_name || null,
      ifscCode: profile.bank_details?.ifsc_code || null,
      accountHolderName: profile.bank_details?.name_of_account_holder || null,
      workarea: workSetup.work_area || null,
      workcity: workSetup.work_city || null,
    };

    return res.status(200).json({
      success: true,
      message: "Delivery partner info fetched successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error fetching delivery partner info:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch delivery partner info",
    });
  }
};