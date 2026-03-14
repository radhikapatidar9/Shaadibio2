const express = require("express");
const router = express.Router();
const {auth} = require('../middleware/authMiddleware');

const {
    sendOTP,
    signUp,
    login,
    resetPasswordToken,
    resetPassword,
    generateBiodataPDF
} = require("../controllers/authController");


// Send OTP
router.post("/send-otp", sendOTP);


// Signup
router.post("/signup", signUp);


// Login
router.post("/login", login);


// Send reset password link
router.post("/reset-password-token", resetPasswordToken);


// Reset password
router.post("/reset-password", resetPassword);

router.get("/download-pdf/:id", auth, generateBiodataPDF);


module.exports = router;