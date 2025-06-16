const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const authMiddleware = require('../middlewares/authMiddleware');

// POST: Shto blerje të re
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { book_id } = req.body;

  if (!book_id) {
    return res.status(400).json({ message: 'book_id është i nevojshëm' });
  }

  try {
    // Kontrollo nëse libri është blerë më parë
    const [existing] = await pool.execute(
      'SELECT * FROM purchases WHERE user_id = ? AND book_id = ?',
      [userId, book_id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Libri është blerë më parë' });
    }

    // Shto blerjen
    await pool.execute(
      'INSERT INTO purchases (user_id, book_id, purchase_date) VALUES (?, ?, NOW())',
      [userId, book_id]
    );

    res.status(201).json({ message: 'Blerje e suksesshme' });
  } catch (err) {
    console.error('Gabim gjatë blerjes:', err);
    res.status(500).json({ message: 'Gabim në server gjatë blerjes' });
  }
});

// GET: Merr librat e blerë nga përdoruesi
router.get('/user-books', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `SELECT b.*
       FROM purchases p
       JOIN books b ON p.book_id = b.id
       WHERE p.user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Gabim gjatë marrjes së librave të blerë:', err);
    res.status(500).json({ message: 'Gabim në server gjatë marrjes së librave të blerë' });
  }
});

module.exports = router;
