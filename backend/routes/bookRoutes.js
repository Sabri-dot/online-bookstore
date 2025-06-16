const express = require('express');
const router = express.Router();
const pool = require('../models/db');

// GET /api/books - Merr të gjithë librat
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM books ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Gabim gjatë marrjes së librave:', error);
    res.status(500).json({ message: 'Gabim në server gjatë marrjes së librave' });
  }
});

// GET /api/books/genre/:genreName - Merr librat sipas zhanrit
router.get('/genre/:genreName', async (req, res) => {
  const { genreName } = req.params;

  try {
    const [rows] = await pool.execute(
      `SELECT b.* FROM books b
       JOIN book_genres bg ON b.id = bg.book_id
       JOIN genres g ON g.id = bg.genre_id
       WHERE g.name = ?`,
      [genreName]
    );
    res.json(rows);
  } catch (error) {
    console.error('Gabim gjatë filtrimit të librave:', error);
    res.status(500).json({ message: 'Gabim në server gjatë filtrimit të librave' });
  }
});

module.exports = router;
