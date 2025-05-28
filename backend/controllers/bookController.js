const path = require('path');
const fs = require('fs');
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
  const { title, author, price, description, is_free, file_url } = req.body;
  try {
    await pool.query(
      'INSERT INTO books (title, author, price, description, is_free, file_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, price, description, is_free, file_url]
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
  const { title, author, price, description, is_free, file_url } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE books SET title = ?, author = ?, price = ?, description = ?, is_free = ?, file_url = ? WHERE id = ?',
      [title, author, price, description, is_free, file_url, id]
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

// Download PDF i librit
exports.downloadBookPdf = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT file_url, title FROM books WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Libri nuk u gjet' });
    }

    const book = rows[0];
    if (!book.file_url) {
      return res.status(404).json({ message: 'PDF nuk ekziston për këtë libër' });
    }

    const filePath = path.join(__dirname, '..', 'uploads', 'pdfs', book.file_url);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File PDF nuk u gjet në server' });
    }

    res.download(filePath, `${book.title}.pdf`);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim në server' });
  }
};

// Upload PDF për libër
exports.uploadBookPdf = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'File PDF nuk u dërgua' });
  }

  const fileUrl = req.file.filename;

  try {
    const [result] = await pool.query(
      'UPDATE books SET file_url = ? WHERE id = ?',
      [fileUrl, id]
    );

    if (result.affectedRows === 0) {
      // Nëse libri nuk ekziston, fshi file-in e ngarkuar për të mos mbetur i papërdorur
      const uploadedPath = path.join(__dirname, '..', 'uploads', 'pdfs', fileUrl);
      if (fs.existsSync(uploadedPath)) {
        fs.unlinkSync(uploadedPath);
      }

      return res.status(404).json({ message: 'Libri nuk u gjet' });
    }

    res.json({ message: 'PDF u ngarkua me sukses', file_url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gabim në server' });
  }
};
