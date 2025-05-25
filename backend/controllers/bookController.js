const pool = require('../models/db');

// Merr të gjithë librat
exports.getAllBooks = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM books');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim në server' });
  }
};

// Merr libër sipas id
exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Libri nuk u gjet' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim në server' });
  }
};

// Shto libër të ri
exports.createBook = async (req, res) => {
  const { title, author, price, description } = req.body;
  try {
    await pool.query(
      'INSERT INTO books (title, author, price, description) VALUES (?, ?, ?, ?)',
      [title, author, price, description]
    );
    res.status(201).json({ message: 'Libri u krijua me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim në server' });
  }
};

// Përditëso libër me id
exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, price, description } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE books SET title = ?, author = ?, price = ?, description = ? WHERE id = ?',
      [title, author, price, description, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Libri nuk u gjet' });
    }
    res.json({ message: 'Libri u përditësua me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim në server' });
  }
};

// Fshij libër me id
exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Libri nuk u gjet' });
    }
    res.json({ message: 'Libri u fshi me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim në server' });
  }
};
