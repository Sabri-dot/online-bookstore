const Log = require('../models/Log'); // rruga ku e ke modelin e logs

// Funksion ndihmës për krijim logu
exports.createLog = async ({ userId, action, details = {}, ipAddress = '', status = '', error = '' }) => {
  try {
    const logEntry = new Log({
      userId,
      action,
      details,
      ipAddress,
      status,
      error,
    });
    await logEntry.save();
  } catch (err) {
    console.error('Gabim gjatë krijimit të logut:', err);
  }
};

// Funksion për logout që krijon log dhe kthen përgjigjen
exports.logout = async (req, res) => {
  const userId = req.user?.id || null;
  const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  try {
    await exports.createLog({
      userId,
      action: 'logout',
      details: {},
      ipAddress,
      status: 'success',
    });

    // Nëse ke ndonjë mekanizëm për invalidim token-i, bëje këtu.
    // Për shembull, fshirja e cookie, ose blacklisting token.

    res.json({ message: 'Logout me sukses' });
  } catch (error) {
    console.error('Gabim në logout:', error);
    res.status(500).json({ message: 'Gabim gjatë procesit të logout' });
  }
};
