const jwt = require("jsonwebtoken");
const Vendor = require("../models/delivery-partner/delivery-partner");
require("dotenv").config(); // Load environment variables from .env file

// Middleware to verify token
exports.auth = (req, res, next) => {
  try {
    // Extract JWT token from cookies, body, or headers
    let token = req.cookies?.token || req.body?.token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }

    // Verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload; // Attach user data to the request object
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying the token",
      error: error.message,
    });
  }
};

// Middleware to check if the user is a regular user
exports.isUser = (req, res, next) => {
  try {
    if (req.user.role !== "user") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for users",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admins",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

// Middleware to check if the user is a vendor
exports.isDeliveryPartner = (req, res, next) => {
  try {
    if (req.user.role !== "DeliveryPartner") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for vendors",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

exports.isCakeOwner = async (req, res, next) => {
  try {
    const cakeId = req.params.id;
    const userId = req.user.id; // Set by auth middleware

    const cake = await CakeDesign.findById(cakeId);
    if (!cake) {
      return res
        .status(404)
        .json({ success: false, message: "Cake design not found" });
    }

    if (cake.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this cake design",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
      error: error.message,
    });
  }
};
