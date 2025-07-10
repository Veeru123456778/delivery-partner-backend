// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localPath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(localPath, { folder });
    fs.unlinkSync(localPath); // Clean local file after upload
    return result.secure_url;
  } catch (err) {
    fs.existsSync(localPath) && fs.unlinkSync(localPath); // Clean even on error
    throw new Error("Cloudinary upload failed: " + err.message);
  }
};

const deleteFromCloudinary = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
};
