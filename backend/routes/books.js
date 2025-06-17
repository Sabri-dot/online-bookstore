const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.get('/best-sellers', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.id, b.title, b.author, b.image_url AS cover_url, COUNT(p.id) AS sales_count
      FROM books b
      JOIN purchases p ON b.id = p.book_id
      GROUP BY b.id
      ORDER BY sales_count DESC
      LIMIT 6;
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching best sellers:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;