const express = require("express");
const router = express.Router();
const { adminLogin, adminLogout, checkAuth } = require("../controller/authController");
const { getDashboardStats } = require("../controller/statsController");
const { getAllProperties, toggleFeatured, getPropertyDetails } = require("../controller/adminPropertyController");
const { getAllUsers, getUserDetails } = require("../controller/adminUserController");
const { isAdmin } = require("../middleware/authMiddleware");

// Public routes
router.post("/login", adminLogin);

// Protected routes
router.use(isAdmin);
router.get("/check-auth", checkAuth);
router.post("/logout", adminLogout);

router.get("/stats", getDashboardStats);

router.get("/properties", getAllProperties);
router.get("/properties/:id", getPropertyDetails);
router.patch("/properties/:id/toggle-featured", toggleFeatured);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetails);

module.exports = router;
