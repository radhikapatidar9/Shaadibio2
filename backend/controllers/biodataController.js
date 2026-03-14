const Biodata = require('../models/Biodata');
const Template = require('../models/Template');
const {uploadImageToCloudinary} = require('../utils/imageUploader');

// create Biodata
exports.createBiodata = async(req, res) => {
    try {

        const {firstName, lastName, gender, dob, height, religion, caste, motherTongue, phone, contactEmail, address,
            education, profession, fatherName, motherName, nativePlace, rashi, nakshatra, gotra, birthPlace,
            birthTime, templateId
        } = req.body;

        if(!req.files || !req.files.profileImage){
            return res.status(400).json({
                success:false,
                message:"Profile image is required"
            })
        }

        if(!templateId){
            return res.status(400).json({
                success:false,
                message:"Template ID is required"
            })
        }

        const profileImage = req.files.profileImage;
        const userId = req.user.id;
        const template = await Template.findById(templateId);

        if(!template){
            return res.status(404).json({
                success:false,
                message:"Template not found"
            });
        }

        if(!firstName || !lastName|| !gender || !dob || !height || !religion || !caste || !motherTongue || !phone ||
            !contactEmail || !address || !education || !profession || !fatherName || !motherName || !nativePlace 
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing!"
            })
        }

        //check image type supported or not
        const supportedTypes = ["jpg","jpeg","png","webp"];

        const fileType = profileImage.name.split(".").pop().toLowerCase();

        if(!supportedTypes.includes(fileType)){
            return res.status(400).json({
                success:false,
                message:"Invalid image format"
            })
        }

        const profileImageUpload = await uploadImageToCloudinary(profileImage, "Shaadibio");

        const newBiodata = await Biodata.create({
            userId, firstName, lastName, gender, dob, height, religion, caste, motherTongue, phone, contactEmail, address, education,
            profession, fatherName, motherName, nativePlace, rashi, nakshatra, gotra, birthPlace, birthTime, templateId,
            profileImage: profileImageUpload.secure_url
        })

        return res.status(201).json({
            success: true,
            message: "Biodata created successfully!",
            data: newBiodata
        })

    } catch(err) {
        console.log("error while creating biodata", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating biodata"
        })
    }
}

//update biodata
exports.updateBiodata = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id;

        const biodata = await Biodata.findById(id);

        // biodata not found
        if(!biodata){
            return res.status(404).json({
                success:false,
                message:"Biodata not found"
            })
        }

        // security check (very important)
        if(biodata.userId.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"Unauthorized to update this biodata"
            })
        }

        // destructure fields
        const {
            firstName,
            lastName,
            gender,
            dob,
            height,
            religion,
            caste,
            motherTongue,
            phone,
            contactEmail,
            address,
            education,
            profession,
            fatherName,
            motherName,
            nativePlace,
            rashi,
            nakshatra,
            gotra,
            birthPlace,
            birthTime,
            templateId
        } = req.body;

        if(templateId){
            const template = await Template.findById(templateId);

            if(!template){
            return res.status(404).json({
                success:false,
                message:"Template not found"
            });
            }
        }

        // update image if provided
        if(req.files && req.files.image){

            const profileImage = req.files.image;

            const supportedTypes = ["jpg","jpeg","png","webp"];
            const fileType = profileImage.name.split(".").pop().toLowerCase();

            if(!supportedTypes.includes(fileType)){
                return res.status(400).json({
                    success:false,
                    message:"Invalid image format"
                })
            }

            const upload = await uploadImageToCloudinary(profileImage, "Shaadibio");

            biodata.profileImage = upload.secure_url;
        }

        // update fields
        biodata.firstName = firstName ?? biodata.firstName;
        biodata.lastName = lastName ?? biodata.lastName;
        biodata.gender = gender ?? biodata.gender;
        biodata.dob = dob ?? biodata.dob;
        biodata.height = height ?? biodata.height;
        biodata.religion = religion ?? biodata.religion;
        biodata.caste = caste ?? biodata.caste;
        biodata.motherTongue = motherTongue ?? biodata.motherTongue;
        biodata.phone = phone ?? biodata.phone;
        biodata.contactEmail = contactEmail ?? biodata.contactEmail;
        biodata.address = address ?? biodata.address;
        biodata.education = education ?? biodata.education;
        biodata.profession = profession ?? biodata.profession;
        biodata.fatherName = fatherName ?? biodata.fatherName;
        biodata.motherName = motherName ?? biodata.motherName;
        biodata.nativePlace = nativePlace ?? biodata.nativePlace;
        biodata.rashi = rashi ?? biodata.rashi;
        biodata.nakshatra = nakshatra ?? biodata.nakshatra;
        biodata.gotra = gotra ?? biodata.gotra;
        biodata.birthPlace = birthPlace ?? biodata.birthPlace;
        biodata.birthTime = birthTime ?? biodata.birthTime;
        biodata.templateId = templateId ?? biodata.templateId;

        await biodata.save();

        return res.status(200).json({
            success:true,
            message:"Biodata updated successfully",
            data:biodata
        });

    } catch(err){

        console.log("Error updating biodata", err);

        return res.status(500).json({
            success:false,
            message:"Error while updating biodata"
        })

    }

}

// delete biodata
exports.deleteBiodata = async (req, res) => {

    try {

        const { id } = req.params;
        const userId = req.user.id;

        const biodata = await Biodata.findById(id);

        // biodata not found
        if(!biodata){
            return res.status(404).json({
                success:false,
                message:"Biodata not found"
            });
        }

        // security check
        if(biodata.userId.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"Unauthorized to delete this biodata"
            });
        }

        await Biodata.findByIdAndDelete(id);

        return res.status(200).json({
            success:true,
            message:"Biodata deleted successfully"
        });

    } catch(err){

        console.log("Error deleting biodata:", err);

        return res.status(500).json({
            success:false,
            message:"Error while deleting biodata"
        });

    }

};

// get biodata
exports.getUserBiodata = async (req, res) => {

    try {

        const userId = req.user.id;

        const biodata = await Biodata.find({ userId })
                                     .populate("templateId", "name templateType previewImage")
                                     .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: biodata.length,
            data: biodata
        });

    } catch(err){

        console.log("Error fetching biodata:", err);

        return res.status(500).json({
            success:false,
            message:"Error fetching biodata"
        });

    }

};

//get single data
exports.getSingleBiodata = async (req,res) => {

    try{

        const { id } = req.params;
        const userId = req.user.id;

        const biodata = await Biodata.findById(id)
                                    .populate("templateId");

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

        return res.status(200).json({
            success:true,
            data:biodata
        });

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Error fetching biodata"
        });

    }

};

// get data by id
exports.getBiodataById = async(req,res)=>{

try{

const biodata = await Biodata.findById(req.params.id)

if(!biodata){
return res.status(404).json({
success:false,
message:"Biodata not found"
})
}

return res.status(200).json({
success:true,
data:biodata
})

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:"Error fetching biodata"
})

}

}

// exports.previewBiodata = async (req, res) => {

// try{

// const { id } = req.params
// const userId = req.user.id

// const biodata = await Biodata.findById(id)

// if(!biodata){
// return res.status(404).json({
// success:false,
// message:"Biodata not found"
// })
// }

// if(biodata.userId.toString() !== userId){
// return res.status(403).json({
// success:false,
// message:"Unauthorized"
// })
// }

// const template = await Template.findById(biodata.templateId)

// let html = template.htmlLayout

// const biodataObj = biodata.toObject()

// Object.keys(biodataObj).forEach(key=>{
// const regex = new RegExp(`{{${key}}}`, "g")
// html = html.replace(regex, biodataObj[key] || "")
// })

// return res.status(200).json({
// success:true,
// html
// })

// }catch(err){

// console.log(err)

// return res.status(500).json({
// success:false,
// message:"Error generating preview"
// })

// }

// }

exports.previewBiodata = async (req,res)=>{

try{

const { id } = req.params

const biodata = await Biodata.findById(id)
const template = await Template.findById(biodata.templateId)

// let html = template.htmlLayout
    let html = `
    <style>
    ${template.cssStyles}
    </style>

    ${template.htmlLayout}
    `

const biodataObj = biodata.toObject()

Object.keys(biodataObj).forEach(key=>{
const regex = new RegExp(`{{${key}}}`,"g")
html = html.replace(regex,biodataObj[key] || "")
})

res.json({
success:true,
html
})

}catch(err){
console.log(err)
}

}