const Comment = require('../models/Comment');
const pool = require('../models/db');
const { ObjectId } = require('mongodb');

exports.getCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ message: 'bookId është i nevojshëm.' });
    }

    const comments = await Comment.find({ bookId }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Gabim gjatë marrjes së komenteve:', error);
    res.status(500).json({ message: 'Gabim serveri gjatë marrjes së komenteve.' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id; // supozojmë që authMiddleware vendos req.user
    const { bookId, commentText, rating, isAnonymous } = req.body;

    if (!bookId || !commentText) {
      return res.status(400).json({ message: 'bookId dhe commentText janë të nevojshme.' });
    }

    const newComment = new Comment({
      userId,
      bookId,
      commentText,
      rating,
      isAnonymous: !!isAnonymous,
      createdAt: new Date()
    });

    await newComment.save();

    res.status(201).json({ message: 'Koment u shtua me sukses!', comment: newComment });
  } catch (error) {
    console.error('Gabim gjatë shtimit të komentit:', error);
    res.status(500).json({ message: 'Gabim serveri gjatë shtimit të komentit.' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;
    const { commentText, rating, isAnonymous } = req.body;

    if (!commentText) {
      return res.status(400).json({ message: 'commentText i ri është i nevojshëm.' });
    }

    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ message: 'Koment nuk u gjet.' });
    }

    if (existingComment.userId !== userId) {
      return res.status(403).json({ message: 'Nuk ke leje për të ndryshuar këtë koment.' });
    }

    existingComment.commentText = commentText;
    if (rating !== undefined) existingComment.rating = rating;
    existingComment.isAnonymous = !!isAnonymous;

    await existingComment.save();

    res.json({ message: 'Koment u përditësua me sukses!', comment: existingComment });
  } catch (error) {
    console.error('Gabim gjatë përditësimit të komentit:', error);
    res.status(500).json({ message: 'Gabim serveri gjatë përditësimit të komentit.' });
  }
};