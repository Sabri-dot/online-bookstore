const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');

// Shembull: endpoint testues
router.get('/', verifyToken, verifyAdmin, (req, res) => {
  res.send('Admin - manage users');
});

module.exports = router;