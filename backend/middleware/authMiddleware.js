const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Not authorized as an admin" });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { isAdmin };
