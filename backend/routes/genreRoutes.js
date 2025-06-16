const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET /api/genres - Merr të gjitha zhanret nga tabela genres
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT name FROM genres ORDER BY name');
    const genres = rows.map(row => row.name);
    res.json(genres);
  } catch (error) {
    console.error('Gabim gjatë marrjes së zhanreve:', error);
    res.status(500).json({ message: 'Gabim në server gjatë marrjes së zhanreve' });
  }
});

module.exports = router;
