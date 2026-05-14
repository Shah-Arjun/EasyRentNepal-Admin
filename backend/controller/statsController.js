const Property = require("../models/propertyModel");
const User = require("../models/userModel");

const getDashboardStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ status: "Available" });
    const rentedProperties = await Property.countDocuments({ status: "Rented" });
    const soldProperties = await Property.countDocuments({ status: "Sold" });

    const totalUsers = await User.countDocuments();
    // Assuming active users means users who have verified OTP or just all users for now
    // If there's an 'isActive' field, we'd use that.
    const activeUsers = await User.countDocuments({ isOtpVerified: true });

    res.status(200).json({
      success: true,
      stats: {
        totalProperties,
        availableProperties,
        rentedProperties,
        soldProperties,
        totalUsers,
        activeUsers,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getDashboardStats };
