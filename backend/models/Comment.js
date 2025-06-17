const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  bookId: { type: String, required: true },
  commentText: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// ✅ Parandalon OverwriteModelError
module.exports = mongoose.models.Comment || mongoose.model('Comment', commentSchema);