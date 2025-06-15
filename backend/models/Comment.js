const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: String,  // ndrysho nga ObjectId në String nëse userId nuk është ObjectId
    required: true,
  },
  bookId: {
    type: String,  // po ashtu
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  rating: Number,
  isAnonymous: Boolean,
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
