const Property = require("../models/propertyModel");

const getAllProperties = async (req, res) => {
  try {
    const { search, status, featured, embedding } = req.query;
    let query = {};

    // Only apply filters if they are provided and not empty strings
    if (search && search.trim() !== "") {
      query.title = { $regex: search, $options: "i" };
    }
    
    if (status && status.trim() !== "") {
      query.status = status;
    }
    
    // Only apply featured filter if specifically requested as "true" or "false"
    if (featured === "true" || featured === "false") {
      query.isFeatured = featured === "true";
    }

    // Embedding filter logic
    if (embedding === "true") {
      query.plot_embedding = { $exists: true, $ne: [] };
    } else if (embedding === "false") {
      query.plot_embedding = { $in: [null, [], undefined] };
    }

    console.log("Fetching properties with query:", JSON.stringify(query));

    const properties = await Property.find(query)
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .lean(); // Use lean() for faster processing and to allow easy modification

    // Map properties to add hasEmbedding flag and remove the heavy embedding array
    const sanitizedProperties = properties.map(property => {
      const hasEmbedding = property.plot_embedding && Array.isArray(property.plot_embedding) && property.plot_embedding.length > 0;
      const { plot_embedding, ...rest } = property;
      return {
        ...rest,
        hasEmbedding
      };
    });

    res.status(200).json({ 
      success: true, 
      count: sanitizedProperties.length,
      properties: sanitizedProperties 
    });
  } catch (error) {
    console.error("CRITICAL: Get properties error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error while fetching properties",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

const toggleFeatured = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
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
    res.status(500).json({ success: false, message: "Internal server error" });
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
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({ success: true, property });
  } catch (error) {
    console.error("Get property details error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Delete property error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getAllProperties,
  toggleFeatured,
  getPropertyDetails,
  deleteProperty,
};
