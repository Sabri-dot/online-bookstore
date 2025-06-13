const express = require('express');
const router = express.Router();
const db = require('../models/db');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { book_id } = req.body;

  if (!book_id) {
    return res.status(400).json({ message: 'Mungon book_id' });
  }

  const sql = 'INSERT INTO purchases (user_id, book_id) VALUES (?, ?)';

  try {
    const [result] = await db.query(sql, [userId, book_id]);  // db.query me promise
    console.log('Resultat i insert:', result);
    return res.status(201).json({ success: true, message: 'Blerja u ruajt me sukses' });
  } catch (err) {
    console.error('Gabim në ruajtjen e blerjes:', err);
    return res.status(500).json({ message: 'Gabim në server' });
  }
});

module.exports = router;