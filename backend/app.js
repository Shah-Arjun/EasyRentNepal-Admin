const express = require("express");
const cors = require("cors");
const app = express();
const connectMongoDB = require("./database/db")
const cookieParser = require('cookie-parser');
require('dotenv').config(); 


// middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}))
app.use(express.json({ limit: '100mb' }))         //helps express to understand/parse JSON
app.use(express.urlencoded({ extended: true, limit: '100mb' }))     //handles data from frontend but doesnot handle file, we need multer for file
app.use(cookieParser());



//calling mongoDB connection function
connectMongoDB();



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
