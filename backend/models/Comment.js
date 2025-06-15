const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: Number, // nëse librat ruhen në MySQL me ID numerik
    required: true,
  },
  commentText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number, // nga 1 deri në 5 yje
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Comment", commentSchema);
