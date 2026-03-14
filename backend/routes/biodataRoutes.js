const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/authMiddleware");


const {
    createBiodata,
    updateBiodata,
    deleteBiodata,
    getUserBiodata,
    getSingleBiodata,
    getBiodataById,
    previewBiodata
} = require("../controllers/biodataController");


// Create Biodata
router.post("/create-biodata", auth, createBiodata);


// Update Biodata
router.put("/update-biodata/:id", auth, updateBiodata);


// Delete Biodata
router.delete("/delete-biodata/:id", auth, deleteBiodata);


// Get all biodata of logged-in user
router.get("/my-biodata", auth, getUserBiodata);

router.get("/get-biodata/:id", auth, getBiodataById)


// Get single biodata
router.get("/biodata/:id", auth, getSingleBiodata);

router.get("/preview/:id", auth, previewBiodata);


module.exports = router;