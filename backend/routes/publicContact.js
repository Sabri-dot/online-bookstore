// routes/publicContact.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/admin/contactController');
const verifyToken = require('../middlewares/verifyToken'); // sigurohu që e ke këtë

// Kjo është rruga që përdoruesi e thërret për të dërguar mesazh
router.post('/', verifyToken, contactController.sendContactMessage); // middleware i saktë këtu

module.exports = router;
