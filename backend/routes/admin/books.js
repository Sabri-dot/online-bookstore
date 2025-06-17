const express = require('express');
const router = express.Router();
const db = require('../../models/db'); // Sipas konfigurimit tënd

const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');

// GET librat për admin me zhanrin bashkë
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT b.*, g.name AS genre
      FROM books b
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gabim gjatë marrjes së librave' });
  }
});
// DELETE libër me id
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const bookId = req.params.id;
    await db.query('DELETE FROM books WHERE id = ?', [bookId]);
    res.status(200).json({ message: 'Libri u fshi me sukses.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë fshirjes së librit.' });
  }
});

// **Shto GET për zhanret**
router.get('/genres', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM genres');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gabim gjatë marrjes së zhanreve' });
  }
});

// **Shto POST për shtimin e librit**
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { title, author, price, is_free, image_url, genre_id } = req.body;

  if (!title || !author || genre_id === undefined) {
    return res.status(400).json({ message: 'Fushat title, author dhe genre_id janë të detyrueshme' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO books (title, author, price, is_free, image_url) VALUES (?, ?, ?, ?, ?)',
      [title, author, price || 0, is_free || false, image_url || null]
    );

    const bookId = result.insertId;

    await db.query('INSERT INTO book_genres (book_id, genre_id) VALUES (?, ?)', [bookId, genre_id]);

    res.status(201).json({ message: 'Libri u shtua me sukses', bookId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë shtimit të librit' });
  }
});
// UPDATE libër me id
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const bookId = req.params.id;
  const { title, author, price, is_free, image_url, genre_id } = req.body;

  if (!title || !author || genre_id === undefined) {
    return res.status(400).json({ message: 'Fushat title, author dhe genre_id janë të detyrueshme' });
  }

  try {
    // Përditëso librin në tabelën books
    await db.query(
      'UPDATE books SET title = ?, author = ?, price = ?, is_free = ?, image_url = ? WHERE id = ?',
      [title, author, price || 0, is_free || false, image_url || null, bookId]
    );

    // Përditëso lidhjen me zhanrin në book_genres
    await db.query(
      'UPDATE book_genres SET genre_id = ? WHERE book_id = ?',
      [genre_id, bookId]
    );

    res.status(200).json({ message: 'Libri u përditësua me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim gjatë përditësimit të librit' });
  }
});

module.exports = router;
