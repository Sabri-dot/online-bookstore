const Log = require('../models/Log');

// Merr log-et (për shembull për admin)
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find().populate('userId', 'name').sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Gabim gjatë marrjes së log-eve", error });
  }
};

// Shto një log të ri
exports.addLog = async (req, res) => {
  const { userId, action, description, ipAddress } = req.body;
  try {
    const newLog = new Log({ userId, action, description, ipAddress });
    await newLog.save();
    res.status(201).json(newLog);
  } catch (error) {
    res.status(500).json({ message: "Gabim gjatë shtimit të log-ut", error });
  }
};
