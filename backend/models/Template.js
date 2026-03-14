const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    previewImage: {
        type: String,
        default: ""
    },
    templateType: {
        type: String,
        enum: ["Free", "Premium"],
        required: true,
    },
    htmlLayout: {
        type: String,
        required:true
    },
    cssStyles: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Template", templateSchema);