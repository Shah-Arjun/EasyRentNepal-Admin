const mongoose = require('mongoose')
const Schema = mongoose.Schema


//admin table
const adminSchema =  new Schema({
    email: {                       //email column
        type: String,   
        required: [true, "Email must be provided"],
        unique: true,
    },
    password: {                    //pw column
        type: String,
        required: [true, "Password must be provided"],
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        default: "admin"
    },
    otp: {
        type: Number,
        select: false
    },
    isOtpVerified: {
        type: Boolean,
        default: false,
        select: false
    },
}, {
    timestamps: true
})

const Admin = mongoose.model("Admin", adminSchema)
module.exports = Admin