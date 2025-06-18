const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Log = require('../models/Log');  // Modeli për ruajtjen e logeve

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Të gjitha fushat janë të detyrueshme.' });
  }

  try {
    const [existingUsers] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email-i është përdorur.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role || 'user']
    );

    res.status(201).json({ message: 'Regjistrimi u krye me sukses.' });
  } catch (error) {
    console.error('Gabim gjatë regjistrimit:', error);
    res.status(500).json({ message: 'Gabim në server gjatë regjistrimit.' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dhe fjalëkalimi janë të detyrueshme.' });
  }

  try {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      await Log.create({
        action: 'login',
        details: { email },
        ipAddress: req.ip,
        status: 'fail',
        error: 'User not found',
      });
      return res.status(401).json({ message: 'Email ose fjalëkalimi i gabuar.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await Log.create({
        userId: user.id.toString(),
        action: 'login',
        details: { email },
        ipAddress: req.ip,
        status: 'fail',
        error: 'Password mismatch',
      });
      return res.status(401).json({ message: 'Email ose fjalëkalimi i gabuar.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    await Log.create({
      userId: user.id.toString(),
      action: 'login',
      details: { email: user.email },
      ipAddress: req.ip,
      status: 'success',
    });

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
    await Log.create({
      action: 'login',
      details: { email },
      ipAddress: req.ip,
      status: 'fail',
      error: error.message,
    });
    res.status(500).json({ message: 'Gabim në server gjatë login.' });
  }
};

const logout = async (req, res) => {
  try {
    await Log.create({
      userId: req.user?.id ? req.user.id.toString() : null,
      action: 'logout',
      status: 'success',
      ipAddress: req.ip,
      details: {},
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Gabim gjatë logout:', error);
    res.status(500).json({ message: 'Gabim gjatë logout' });
  }
};

module.exports = {
  register,
  login,
  logout,
};
