const Template = require("../models/Template");
const {uploadImageToCloudinary} = require('../utils/imageUploader');

//create template
exports.createTemplate = async (req, res) => {

    try {

        const { name, description, templateType, htmlLayout, cssStyles } = req.body;

        if(!name || !description || !templateType || !htmlLayout){
        return res.status(400).json({
            success:false,
            message:"Required fields missing"
        });
        }

        if(!req.files || !req.files.previewImage){
        return res.status(400).json({
            success:false,
            message:"Preview image required"
        });
        }

        const previewImage = req.files.previewImage;

        const upload = await uploadImageToCloudinary(previewImage, "ShaadibioTemplates");

        const template = await Template.create({
        name,
        description,
        templateType,
        htmlLayout,
        cssStyles,
        previewImage: upload.secure_url
        });

        return res.status(201).json({
        success:true,
        message:"Template created successfully",
        data:template
        });

    } catch(err){

        console.log(err);

        return res.status(500).json({
            success:false,
            message:"Error creating template"
        });

    }
};

// get all template
exports.getAllTemplates = async (req, res) => {

    try{

        const templates = await Template.find({ isActive:true })
                                        .select("name description previewImage templateType");

        return res.status(200).json({
        success:true,
        data:templates
        });

        } catch(err){

        return res.status(500).json({
        success:false,
        message:"Error fetching templates"
        });

    }

};

//getsingle template
exports.getTemplate = async (req, res) => {

    try{

        const { id } = req.params;

        const template = await Template.findById(id);

        if(!template){
        return res.status(404).json({
            success:false,
            message:"Template not found"
        });
        }

        return res.status(200).json({
        success:true,
        data:template
        });

    } catch(err){

        return res.status(500).json({
            success:false,
            message:"Error fetching template"
        });

    }

};

// update template
// exports.updateTemplate = async (req, res) => {

//     try{

//         const { id } = req.params;

//         const updatedTemplate = await Template.findByIdAndUpdate(
//         id,
//         req.body,
//         { new:true }
//         );

//         if(!updatedTemplate){
//         return res.status(404).json({
//             success:false,
//             message:"Template not found"
//         });
//         }

//         return res.status(200).json({
//         success:true,
//         message:"Template updated",
//         data:updatedTemplate
//         });

//     } catch(err){

//         return res.status(500).json({
//             success:false,
//             message:"Error updating template"
//         });

//     }

// };  

exports.updateTemplate = async (req, res) => {

try{

const { id } = req.params

let updateData = req.body

// if new preview image uploaded
if(req.files && req.files.previewImage){

const previewImage = req.files.previewImage

const upload = await uploadImageToCloudinary(
previewImage,
"ShaadibioTemplates"
)

updateData.previewImage = upload.secure_url

}

const updatedTemplate = await Template.findByIdAndUpdate(
id,
updateData,
{ new:true }
)

if(!updatedTemplate){
return res.status(404).json({
success:false,
message:"Template not found"
})
}

return res.status(200).json({
success:true,
message:"Template updated",
data:updatedTemplate
})

}catch(err){

console.log(err)

return res.status(500).json({
success:false,
message:"Error updating template"
})

}

}

// delete template
exports.deleteTemplate = async (req, res) => {

    try{

        const { id } = req.params;

        const template = await Template.findByIdAndDelete(id);

        if(!template){
        return res.status(404).json({
            success:false,
            message:"Template not found"
        });
        }

        return res.status(200).json({
        success:true,
        message:"Template deleted successfully"
        });

    } catch(err){

        return res.status(500).json({
            success:false,
            message:"Error deleting template"
        });

    }

};