const Comment = require('../models/Comment');
const pool = require('../models/db');
const { ObjectId } = require('mongodb');

exports.getComments = async (req, res) => {
  const { bookId } = req.params;
  try {
    const comments = await Comment.find({ bookId }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gabim gjatë marrjes së komenteve" });
  }
};

exports.addComment = async (req, res) => {
  const userId = req.user.id;
  const { bookId, commentText, rating, isAnonymous } = req.body;

  if (!bookId || !commentText) {
    return res.status(400).json({ message: "Mungon bookId ose commentText" });
  }

  try {
    // Kontrollo në MySQL nëse përdoruesi ka blerë librin
    const [rows] = await pool.execute(
      'SELECT * FROM purchases WHERE user_id = ? AND book_id = ?',
      [userId, bookId]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Nuk mund të komentosh këtë libër pasi nuk e ke blerë." });
    }

    const newComment = new Comment({ userId, bookId, commentText, rating, isAnonymous: !!isAnonymous });
    await newComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gabim gjatë shtimit të komentit", error });
  }
};

exports.editComment = async (req, res) => {
  const userId = req.user.id;
  const { commentText, rating, isAnonymous } = req.body;
  const { commentId } = req.params; // Marrim ID nga URL

  if (!commentId || !commentText) {
    return res.status(400).json({ message: "Mungon commentId ose commentText" });
  }

  try {
    const comment = await Comment.findById(new ObjectId(commentId));

    if (!comment) {
      return res.status(404).json({ message: "Koment nuk u gjet" });
    }

    if (comment.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Nuk ke leje të modifikosh këtë koment" });
    }

    // Kontrollo në MySQL nëse ka blerje për librin
    const [rows] = await pool.execute(
      'SELECT * FROM purchases WHERE user_id = ? AND book_id = ?',
      [userId, comment.bookId]
    );
    if (rows.length === 0) {
      return res.status(403).json({ message: "Nuk mund të modifikosh koment për libër të pa blerë" });
    }

    comment.commentText = commentText;
    comment.rating = rating || comment.rating;
    comment.isAnonymous = !!isAnonymous;

    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gabim gjatë modifikimit të komentit", error });
  }
};

