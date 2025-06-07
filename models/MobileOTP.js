const mongoose = require("mongoose");
const twilio = require("twilio");
require("dotenv").config(); // Ensure dotenv is configured to load .env variables

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Check if Twilio credentials are loaded
if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("Twilio credentials are not loaded. Check your .env file.");
  // Optionally, throw an error or exit if credentials are critical
  // process.exit(1);
}

const client = twilio(accountSid, authToken);

const OTPSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Ensures a 10-digit mobile number
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes
  },
});

// Define a function to send OTP via SMS
async function sendOTPViaSMS(mobileNumber, otp) {
  try {
    const message = await client.messages.create({
      body: `🌟 Welcome to CakeWake! 🌟\n\nYour secure OTP is: ${otp}\n\nThank you for joining us. Please enter this code to continue your sweet journey! 🍰`,
      from: twilioPhoneNumber, // Twilio phone number
      to: `+91${mobileNumber}`, // Recipient's mobile number (with country code)
    });
    console.log(`OTP sent successfully to ${mobileNumber}: ${message.sid}`);
  } catch (error) {
    console.log("Error occurred while sending OTP: ", error);
    throw error;
  }
}

// Define a pre-save hook to send OTP after the document has been saved
OTPSchema.pre("save", async function (next) {
  console.log("New OTP document saved to database");

  // Only send an OTP when a new document is created
  if (this.isNew) {
    await sendOTPViaSMS(this.mobileNumber, this.otp);
  }
  next();
});

const MobileOTP = mongoose.model("MobileOTP", OTPSchema);

module.exports = MobileOTP;
