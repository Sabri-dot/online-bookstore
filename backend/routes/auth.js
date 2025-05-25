const express = require('express');
const router = express.Router();

// Route për testim
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route works!' });
});

module.exports = router;
