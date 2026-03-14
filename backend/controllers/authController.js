const User = require('../models/User');
const Biodata = require('../models/Biodata');
const Template = require('../models/Template');
const OTP = require('../models/OTP');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const crypto = require("crypto");
const puppeteer = require("puppeteer");
require('dotenv').config();
const getBrowser = require("../utils/browser")

//sendOTP
exports.sendOTP = async(req, res) => {
    try {

        const {email} = req.body;
        const checkUserPresent = await User.findOne({email});
        if(checkUserPresent) {
            return res.status(400).json({
                success:false,
                message: "user registered already"
            })
        }
        // generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log("OTP Generated", otp)

        // otp must be unique - check
        let result = await OTP.findOne({otp: otp});
        while(result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        // create an entry for otp
        await OTP.create(otpPayload);

        try {
            const info = await mailSender(email, "Verification OTP", `Your OTP is ${otp}`);
            console.log("MAIL SENDER INFO:", info);
        } catch (mailError) {
            console.log("MAIL SENDER FAILED:", mailError);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Check mail configuration."
            });
        }

        // await mailSender(email, "Verification OTP", `Your OTP is ${otp}`);

        // return response successful
        return res.status(200).json({
            success: true,
            data: otpPayload,
            message: "Otp send Successfully!",

        })

    } catch(err) {
        console.log("REAL ERROR:", err);

        return res.status(500).json({
            success:false,
            message: err.message
        })
    }
}

//signup
exports.signUp = async(req, res) => {
    try {

        const {firstName, lastName, email, password, confirmPassword, otp} = req.body;

        // 1. check all fields are filled or not
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.json({
                success: false,
                message: "Fill all the fields carefully!"
            })
        }

        //2. check if user already registered
        const emailCheck = await User.findOne({email: email});
        if(emailCheck) {
            return res.status(400).json({
                success:false,
                message:"User registered already!"
            })
        }

        //password/confirmpass check
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Check password carefully!"
            })
        }

        // find most recent OTP for user
        // const recentOTP = await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        // console.log(recentOTP);

        // const recentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 });

        // validate OTP
        // find most recent OTP
const recentOTP = await OTP.find({ email })
   .sort({ createdAt: -1 })
   .limit(1);

   console.log("OTP from frontend:", otp)
console.log("OTP from database:", recentOTP?.otp)
console.log("Type frontend:", typeof otp)
console.log("Type database:", typeof recentOTP?.otp)

if(recentOTP.length === 0){
   return res.status(401).json({
      success:false,
      message:"OTP not found"
   })
}

if(otp !== String(recentOTP[0].otp)){
   return res.status(401).json({
      success:false,
      message:"Invalid OTP"
   })
}
        // hashed password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch(err) {
            return res.json({
                success: false,
                message: "Error occured while hashing the password!"
            })
        }

        const user = await User.create({
            firstName, lastName, email, password:hashedPassword,
            userImage:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })
        return res.status(200).json({
            success:true,
            message: "Account created successfully!",
            user
        })

    } catch(err) {
        console.log("Error Occcured while sign Up!", err);
        return res.json({
            success:false,
            message: "Error Occured while sign up"
        })
    }
}

// login
exports.login = async(req, res) => {
    try {

        const {email, password} = req.body;

        // verify email
        if(!email || !password) {
            return res.json({
                success:false,
                message: "Fill details carefully!"
            })
        }

        // check if user not registered
        const user = await User.findOne({email: email});
        if(!user) {
            return res.json({
                success:false,
                message: "User Not Registered"
            })
        }

        // check password correct or not
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({
                success:false,
                message: "Password Incorrect!"
            })
        }
        const payload = {
            id: user._id,
            email: user.email
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '3d'});
        const userObj = user.toObject();
        userObj.token = token;
        delete userObj.password;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true, // no access at client side
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        }

        res.cookie("token", token, options).status(200).json({
            success:true,
            message: "User logged in successfully!",
            user: userObj,
            token
        })

        

    } catch(err) {
        console.log(err);
        res.json({
            success:false,
            message: "Error occured while login"
        })
    }
}

exports.resetPasswordToken = async(req, res) => {
    try {

        const {email} = req.body;
        // validation
        if(!email) {
            return res.json({
                success: false,
                message: "Please fill the field carefully!"
            })
        }

        // check if user not registered
        const user = await User.findOne({email});
        if(!user) {
            return res.json({
                success: false,
                message: "User with this email never registered!"
            })
        }

        // generate token for reset password link
        // const resetToken = crypto.randomBytes(32).toString("hex");
        const resetToken = crypto.randomUUID();
        // User = User.toObject();
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() +15 * 60 * 1000;

        await user.save();

        // create link
        const url = `${process.env.FRONTEND_URL}/update-password/${resetToken}`;

        // send link to reset password on user email
        await mailSender(user.email, "Below is the link for passwork change", `Password reset link ${url}`);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });


    } catch(err) {
        console.log(err);
        res.status(500).json({
            success:false,
            message: "Error occcured while reset password!",
            err
        })
    }
}

// resetPassword
exports.resetPassword = async(req, res) => {
    try {

        // fetch data
        const {password, confirmPassword, resetToken} = req.body;

        // validation
        if(!password || !confirmPassword || !resetToken) {
            return res.status(400).json({
                success:false,
                message: "Check fields carefully"
            })
        }
        const user = await User.findOne({resetToken: resetToken});

        if(!user) {
            return res.status(401).json({
                success:false,
                message: "Invalid token!"
            })
        }

         // token time check
        if(user.resetTokenExpiry < Date.now()) {
            return res.json({
                success:false,
                message: "Token expires!"
            })
        }

       if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        })



    } catch(err) {
        return res.status(500).json({
            success:false,
            message: "Error occured while reset password!"
        })
    }
}

exports.generateBiodataPDF = async (req, res) => {

    try {

    const { id } = req.params;
    const userId = req.user.id;

    const biodata = await Biodata.findById(id);

    if(!biodata){
    return res.status(404).json({
        success:false,
        message:"Biodata not found"
    });
    }

    if(biodata.userId.toString() !== userId){
    return res.status(403).json({
        success:false,
        message:"Unauthorized access"
    });
    }

    const template = await Template.findById(biodata.templateId);

    if(!template){
    return res.status(404).json({
        success:false,
        message:"Template not found"
    });
    }

    // let html = template.htmlLayout;
    let html = `
    <style>
    ${template.cssStyles}
    </style>

    ${template.htmlLayout}
    `

    // Replace placeholders
    const biodataObj = biodata.toObject();

    Object.keys(biodataObj).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, "g");
        html = html.replace(regex, biodataObj[key] || "");
    });

    // launch browser

    const browser = await getBrowser()

    const page = await browser.newPage();

    await page.setContent(html,{ waitUntil:"networkidle0" })

    const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true
    });

    await page.close();

    res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=biodata.pdf`
    });

    res.send(pdfBuffer);

    } catch(err){

    console.log(err);

    return res.status(500).json({
    success:false,
    message:"Error generating PDF"
    });

    }

};
