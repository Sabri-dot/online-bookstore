const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/admin/contactController');
const { verifyToken, verifyAdmin } = require('../../middlewares/verifyToken');

// GET all emails
router.get('/', verifyToken, verifyAdmin, contactController.getAllEmails);

// POST create new email (admin-only për këtë rast)
router.post('/', verifyToken, verifyAdmin, contactController.createEmail);

// PUT update email
router.put('/:id', verifyToken, verifyAdmin, contactController.updateEmail);

// DELETE email
router.delete('/:id', verifyToken, verifyAdmin, contactController.deleteEmail);

module.exports = router;
