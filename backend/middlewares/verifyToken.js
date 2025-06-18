const jwt = require('jsonwebtoken');
const pool = require('../models/db'); // lidhja me MySQL
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Middleware për verifikimin e token-it dhe marrjen e user-it nga MySQL
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mungon ose është i pavlefshëm' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token i pavlefshëm' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Kërko përdoruesin në MySQL me id-në nga token-i
    const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Përdoruesi nuk u gjet' });
    }

    const foundUser = rows[0];

    // Vendosim të dhënat në req.user për rrugët private
    req.user = {
      id: foundUser.id,
      role: foundUser.role,
      email: foundUser.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token i pavlefshëm ose gabim gjatë verifikimit' });
  }
};

// Middleware për të lejuar vetëm adminët
const verifyAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Qasja e ndaluar - vetëm për adminë' });
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
};
