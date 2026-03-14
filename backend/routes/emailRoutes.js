const express = require('express');
const router = express.Router();
const { subscribe } = require('../controllers/emailController');

// POST /api/v1/email/subscribe
router.post('/subscribe', subscribe);

module.exports = router;
