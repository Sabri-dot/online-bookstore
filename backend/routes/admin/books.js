const express = require('express');
const router = express.Router();
const verifyToken = require('../../middlewares/verifyToken'); // ekzistues
const verifyAdmin = require('../../middlewares/verifyAdmin');

router.get('/', verifyToken, verifyAdmin, (req, res) => {
  res.send('Admin - manage books');
});

module.exports = router;