const Comment = require('../models/Comment');

// Merr komentet për një libër specifik
exports.getComments = async (req, res) => {
  const bookId = req.params.bookId;
  try {
    const comments = await Comment.find({ bookId }).populate('userId', 'name');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Gabim gjatë marrjes së komenteve", error });
  }
};

// Shto një koment të ri
exports.addComment = async (req, res) => {
  const { userId, bookId, commentText, rating } = req.body;
  try {
    const newComment = new Comment({ userId, bookId, commentText, rating });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Gabim gjatë shtimit të komentit", error });
  }
};
