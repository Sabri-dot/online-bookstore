// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token i munguar' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ruaj info të përdoruesit në req.user për përdorim të mëtejshëm
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token i pavlefshëm' });
  }
};

module.exports = authMiddleware;


module.exports = authMiddleware;
