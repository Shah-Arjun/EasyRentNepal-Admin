const User = require("../models/userModel");
const Property = require("../models/propertyModel");
const Booking = require("../models/bookingModel");

const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    // For each user, get their property count
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const propertyCount = await Property.countDocuments({ owner: user._id });
        return {
          ...user.toObject(),
          propertyCount,
        };
      })
    );

    res.status(200).json({ success: true, users: usersWithStats });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const listedProperties = await Property.find({ owner: user._id });
    const bookings = await Booking.find({ tenant: user._id }).populate("property", "title location price");

    res.status(200).json({
      success: true,
      user,
      listedProperties,
      bookings,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
};
