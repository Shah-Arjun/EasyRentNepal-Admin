const Property = require("../models/propertyModel");

const getAllProperties = async (req, res) => {
  try {
    const { search, status, featured } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    if (featured !== undefined) {
      query.isFeatured = featured === "true";
    }

    const properties = await Property.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error("Get properties error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    property.isFeatured = !property.isFeatured;
    await property.save();

    res.status(200).json({
      success: true,
      message: `Property ${property.isFeatured ? "featured" : "unfeatured"} successfully`,
      property,
    });
  } catch (error) {
    console.error("Toggle featured error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPropertyDetails = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate("owner", "name email phoneNumber profileImage location")
      .populate({
        path: "bookings",
        populate: { path: "tenant", select: "name email" }
      });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    console.error("Get property details error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllProperties,
  toggleFeatured,
  getPropertyDetails,
};
