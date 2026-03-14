const mongoose = require('mongoose');

const biodataSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    gender:{
        type: String,
        required:true,
        enum: ["Male", "Female", "Other"],
        trim:true
    },
    dob: {
        type: Date,
        required: true
    },
    height: {
        type: String,
        required:true
    },
    religion: {
        type: String,
        required: true
    },
    caste: {
        type: String,
        required: true
    },
    motherTongue: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    education: {
        type: String,
        required:true
    },
    profession: {
        type: String,
        required: true
    },
    fatherName: {
        type: String,
        required:true,
        trim:true
    },
    motherName: {
        type: String,
        required:true,
        trim:true
    },
    nativePlace: {
        type: String,
        required:true,
        trim:true
    },
    rashi: {
        type: String,
        trim:true
    },
    nakshatra:{
        type: String,
        trim:true
    },
    gotra: {
        type: String,
        trim:true
    },
    birthPlace: {
        type: String,
        trim:true
    },
    birthTime: {
        type: String,
        trim:true
    },
    profileImage: {
        type: String,
        required:true,
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template"
    }
}, {timestamps: true});
module.exports = mongoose.model("Biodata", biodataSchema);