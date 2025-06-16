const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Të gjitha fushat janë të detyrueshme.' });
  }

  try {
    // Kontrollo nëse ekziston përdoruesi me email
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email-i është përdorur.' });
    }

    // Hash fjalëkalimin
    const hashedPassword = await bcrypt.hash(password, 10);

    // Shto përdoruesin
    await pool.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Regjistrimi u krye me sukses.' });
  } catch (error) {
    console.error('Gabim gjatë regjistrimit:', error);
    res.status(500).json({ message: 'Gabim në server gjatë regjistrimit.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dhe fjalëkalimi janë të detyrueshme.' });
  }

  try {
    // Gjej përdoruesin sipas email-it
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ose fjalëkalimi i gabuar.' });
    }

    const user = users[0];

    // Kontrollo fjalëkalimin
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Email ose fjalëkalimi i gabuar.' });
    }

    // Gjenero token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Kthe token dhe user info (pa password)
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Gabim gjatë login:', error);
    res.status(500).json({ message: 'Gabim në server gjatë login.' });
  }
};
