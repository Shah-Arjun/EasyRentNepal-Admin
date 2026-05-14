const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      console.log("AUTH_ERROR: No adminToken cookie found in request");
      return res.status(401).json({ success: false, message: "Not authorized, please login" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (jwtError) {
      console.error("AUTH_ERROR: JWT verification failed:", jwtError.message);
      return res.status(401).json({ success: false, message: "Session expired, please login again" });
    }
    
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      console.log("AUTH_ERROR: Admin user not found in database for ID:", decoded.id);
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    if (admin.role !== "admin") {
      console.log("AUTH_ERROR: User exists but does not have admin role. User ID:", admin._id);
      return res.status(403).json({ success: false, message: "Access denied. Admin privileges required." });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("AUTH_CRITICAL_ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error during authentication" });
  }
};

module.exports = { isAdmin };
