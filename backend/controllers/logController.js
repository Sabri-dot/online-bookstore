const Log = require('../models/Log');

// Krijon një log
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

// GET /api/logs – merr të gjitha logjet
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).populate('userId', 'email');
    res.json(logs);
  } catch (err) {
    console.error('Gabim në marrjen e logeve:', err);
    res.status(500).json({ message: 'Gabim gjatë marrjes së logeve' });
  }
};

// POST /api/logs – shton log manualisht
exports.addLog = async (req, res) => {
  try {
    const { userId, action, details, ipAddress, status, error } = req.body;
    const log = new Log({ userId, action, details, ipAddress, status, error });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    console.error('Gabim në shtimin e logut:', err);
    res.status(500).json({ message: 'Gabim gjatë shtimit të logut' });
  }
};
// PUT /api/logs/:id – përditëson një log ekzistues
exports.updateLog = async (req, res) => {
  const { id } = req.params;
  const { userId, action, details, ipAddress, status, error } = req.body;

  try {
    const updatedLog = await Log.findByIdAndUpdate(
      id,
      { userId, action, details, ipAddress, status, error },
      { new: true }
    );

    if (!updatedLog) {
      return res.status(404).json({ message: 'Logu nuk u gjet' });
    }

    res.json(updatedLog);
  } catch (err) {
    console.error('Gabim gjatë përditësimit të logut:', err);
    res.status(500).json({ message: 'Gabim gjatë përditësimit të logut' });
  }
};
// DELETE /api/logs/:id – fshin log me ID
exports.deleteLog = async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Logu nuk u gjet' });
    }
    res.json({ message: 'Logu u fshi me sukses' });
  } catch (err) {
    console.error('Gabim në fshirjen e logut:', err);
    res.status(500).json({ message: 'Gabim gjatë fshirjes së logut' });
  }
};

// LOGOUT – siç e kishe
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

    res.json({ message: 'Logout me sukses' });
  } catch (error) {
    console.error('Gabim në logout:', error);
    res.status(500).json({ message: 'Gabim gjatë logout' });
  }
};
