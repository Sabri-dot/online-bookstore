const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../models/db'); 
const { verifyToken, verifyAdmin } = require('../../middlewares/verifyToken');

// GET all users (pa password)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, username, email, role, created_at FROM users'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gabim gjatë marrjes së përdoruesve' });
  }
});

// GET user by ID (pa password)
router.get('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Përdoruesi nuk u gjet' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gabim gjatë marrjes së përdoruesit' });
  }
});

// POST create user
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Plotësoni të gjitha fushat e nevojshme' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role || 'user']
    );
    res.status(201).json({ message: 'Përdoruesi u krijua me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gabim gjatë krijimit të përdoruesit' });
  }
});

// PUT update user fleksibël
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  try {
    const fields = [];
    const params = [];

    if (username !== undefined) {
      fields.push('username = ?');
      params.push(username);
    }

    if (email !== undefined) {
      fields.push('email = ?');
      params.push(email);
    }

    if (role !== undefined) {
      fields.push('role = ?');
      params.push(role);
    }

    if (password !== undefined) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push('password = ?');
      params.push(hashedPassword);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Asnjë fushë përditësimi nuk u dhënë' });
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    params.push(id);

    const [result] = await db.execute(query, params);

    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Përdoruesi nuk u gjet' });

    res.json({ message: 'Përdoruesi u përditësua me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gabim gjatë përditësimit të përdoruesit' });
  }
});

// DELETE user
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: 'Përdoruesi nuk u gjet' });
    res.json({ message: 'Përdoruesi u fshi me sukses' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gabim gjatë fshirjes së përdoruesit' });
  }
});

module.exports = router;
