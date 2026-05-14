const express = require("express");
const cors = require("cors");
const app = express();
const connectMongoDB = require("./database/db")
const cookieParser = require('cookie-parser');
require('dotenv').config(); 

// 1. Register ALL models FIRST to prevent MissingSchemaError during population
require("./models/adminModel");
require("./models/userModel");
require("./models/propertyModel");
require("./models/agencyModel");
require("./models/bookingModel");
require("./models/paymentModel");
require("./models/reviewModel");
require("./models/wishlistModel");
require("./models/userActivityModel");

// 2. Load controllers/routes AFTER models are registered
const adminSeeder = require("./adminSeeder");
const adminRoutes = require("./routes/adminRoutes");

// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ extended: true, limit: '100mb' }))
app.use(cookieParser());

// calling mongoDB connection function
connectMongoDB().then(() => {
    // Run admin seeder after DB connection
    adminSeeder();
});

// Routes
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
    res.send("Admin Backend is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
