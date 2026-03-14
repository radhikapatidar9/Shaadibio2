const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
        expires: 5*60
    },
    otp: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("OTP", otpSchema);
