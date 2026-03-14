const express = require("express");
const router = express.Router();

const {
 createTemplate,
 getAllTemplates,
 getTemplate,
 updateTemplate,
 deleteTemplate
} = require("../controllers/templateController");

router.post("/create-template", createTemplate);
router.get("/templates", getAllTemplates);
router.get("/templates/:id", getTemplate);
router.put("/templates/:id", updateTemplate);
router.delete("/templates/:id", deleteTemplate);

module.exports = router;