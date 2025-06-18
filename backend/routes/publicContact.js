const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/verifyToken');
const contactController = require('../controllers/admin/contactController');


// Rruga për dërgimin e mesazhit nga përdoruesit e autentifikuar
router.post('/', verifyToken, contactController.sendContactMessage);

module.exports = router;
