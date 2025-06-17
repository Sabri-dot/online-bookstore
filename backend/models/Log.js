const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: { type: String, required: false },  // ndryshuar nga ObjectId në String
  action: { type: String, required: true },
  details: { type: Object },
  ipAddress: { type: String },
  status: { type: String },
  error: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', logSchema);
