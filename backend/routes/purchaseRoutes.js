const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const pool = require('../models/db');

// GET: Merr librat e blerë të përdoruesit të kyçur
router.get('/user-books', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const [rows] = await pool.execute(
      'SELECT book_id FROM purchases WHERE user_id = ?',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Gabim gjatë marrjes së librave të blerë:', error);
    res.status(500).json({ message: 'Gabim në server' });
  }
});

// POST: krijo një blerje të re
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { book_id } = req.body;

  try {
    const [existing] = await pool.execute(
      'SELECT * FROM purchases WHERE user_id = ? AND book_id = ?',
      [userId, book_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Libri është blerë më parë.' });
    }

    await pool.execute(
      'INSERT INTO purchases (user_id, book_id) VALUES (?, ?)',
      [userId, book_id]
    );

    res.status(201).json({ message: 'Blerja u krye me sukses!' });
  } catch (error) {
    console.error('Gabim gjatë blerjes:', error);
    res.status(500).json({ message: 'Gabim gjatë blerjes.' });
  }
});

module.exports = router;
