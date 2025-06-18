const express = require('express');
const router = express.Router();
const db = require('../../models/db'); // lidhja me MySQL
const { verifyToken, verifyAdmin } = require('../../middlewares/verifyToken');

// GET - marr të gjitha blerjet me info bazë (user dhe book)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
   SELECT p.id, u.email AS user_email, b.title AS book_title, p.purchase_date, b.price
  FROM purchases p
  JOIN users u ON p.user_id = u.id
  JOIN books b ON p.book_id = b.id
  ORDER BY p.purchase_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë marrjes së blerjeve' });
  }
});

// POST - krijo blerje të re
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { user_id, book_id } = req.body;
  if (!user_id || !book_id) {
    return res.status(400).json({ message: 'user_id dhe book_id janë të detyrueshme' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO purchases (user_id, book_id) VALUES (?, ?)',
      [user_id, book_id]
    );
    res.status(201).json({ message: 'Blerja u krijua me sukses', purchaseId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë krijimit të blerjes.' });
  }
});

// DELETE - fshi blerje me id
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const purchaseId = req.params.id;
  try {
    const [result] = await db.query('DELETE FROM purchases WHERE id = ?', [purchaseId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Blerja nuk u gjet' });
    }
    res.json({ message: 'Blerja u fshi me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë fshirjes së blerjes' });
  }
});

module.exports = router;
