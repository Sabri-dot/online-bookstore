const express = require('express');
const router = express.Router();
const db = require('../../models/db'); // lidhja me MySQL
const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');

// GET - Merr të gjitha genres
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM genres ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë marrjes së zhanreve' });
  }
});

// POST - Shto një genre të re
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Emri i zhanrit është i detyrueshëm' });
  }
  try {
    await db.query('INSERT INTO genres (name) VALUES (?)', [name]);
    res.status(201).json({ message: 'Zhanri u shtua me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë shtimit të zhanrit' });
  }
});

// PUT - Përditëso një genre me id
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Emri i zhanrit është i detyrueshëm' });
  }
  try {
    const [result] = await db.query('UPDATE genres SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Zhanri nuk u gjet' });
    }
    res.json({ message: 'Zhanri u përditësua me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë përditësimit të zhanrit' });
  }
});

// DELETE - Fshi një genre me id
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM genres WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Zhanri nuk u gjet' });
    }
    res.json({ message: 'Zhanri u fshi me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë fshirjes së zhanrit' });
  }
});

module.exports = router;