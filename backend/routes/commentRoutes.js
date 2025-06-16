const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const authMiddleware = require('../middlewares/authMiddleware');

// Merr të gjitha komentet për një libër
router.get('/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const comments = await Comment.find({ bookId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error('Gabim gjatë marrjes së komenteve:', error);
    res.status(500).json({ message: 'Gabim në server' });
  }
});

// Shto koment të ri (auth kërkohet)
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST body:', req.body);
  const { bookId, commentText, rating, isAnonymous, displayName } = req.body;

  if (!bookId || !commentText) {
    return res.status(400).json({ message: 'bookId dhe commentText janë të nevojshme.' });
  }

  try {
    const userId = req.user.id || req.user._id;

    const newComment = new Comment({
      userId,
      bookId,
      commentText,
      rating,
      isAnonymous: !!isAnonymous,
      displayName: displayName || '',
      createdAt: new Date(),
    });

    await newComment.save();
    res.status(201).json({ message: 'Koment u shtua me sukses!', comment: newComment });
  } catch (error) {
    console.error('Gabim gjatë shtimit të komentit:', error);
    res.status(500).json({ message: 'Gabim gjatë shtimit të komentit.' });
  }
});

// Përditëso koment (auth kërkohet)
router.put('/:commentId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { commentId } = req.params;
  const { commentText, rating, isAnonymous } = req.body;

  if (!commentText) {
    return res.status(400).json({ message: 'commentText i ri është i nevojshëm.' });
  }

  try {
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
    res.status(500).json({ message: 'Gabim në server gjatë përditësimit.' });
  }
});

// Fshi koment (auth kërkohet)
router.delete('/:commentId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { commentId } = req.params;

  try {
    const existingComment = await Comment.findById(commentId);

    if (!existingComment) {
      return res.status(404).json({ message: 'Koment nuk u gjet.' });
    }

    if (existingComment.userId !== userId) {
      return res.status(403).json({ message: 'Nuk ke leje për të fshirë këtë koment.' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: 'Koment u fshi me sukses.' });
  } catch (error) {
    console.error('Gabim gjatë fshirjes së komentit:', error);
    res.status(500).json({ message: 'Gabim në server gjatë fshirjes.' });
  }
});

module.exports = router;
