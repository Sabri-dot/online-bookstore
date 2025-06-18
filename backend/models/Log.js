const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  action: { type: String, required: true },
  status: { type: String, required: true },
  ipAddress: { type: String },
  details: { type: Object },
  createdAt: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);

Log.create = function(data) {
  const log = new Log(data);
  return log.save();
};

module.exports = Log;
