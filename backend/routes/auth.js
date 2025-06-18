const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const logController = require('../controllers/logController');

// Rrugët ekzistuese
router.post('/register', authController.register);
router.post('/login', authController.login);

// Shto logout me verifyToken dhe logController
router.post('/logout', verifyToken, logController.logout);

module.exports = router;
