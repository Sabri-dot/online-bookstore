const express = require('express');
const router = express.Router();
const Comment = require('../../models/Comment'); // modeli MongoDB

const { verifyToken, verifyAdmin } = require('../../middlewares/verifyToken');
// GET - Merr të gjitha komentet
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Gabim gjatë marrjes së komenteve' });
  }
});

// POST - Shto një koment
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  const { userId, bookId, commentText, rating, isAnonymous } = req.body;

  if (!userId || !bookId || !commentText) {
    return res.status(400).json({ message: 'Të dhëna të pamjaftueshme për të shtuar komentin' });
  }

  try {
    const newComment = new Comment({ userId, bookId, commentText, rating, isAnonymous });
    await newComment.save();
    res.status(201).json({ message: 'Komenti u shtua me sukses', comment: newComment });
  } catch (err) {
    res.status(500).json({ message: 'Gabim gjatë shtimit të komenteve' });
  }
});
// PUT - Përditëso një koment
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  const { commentText, rating, isAnonymous } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { commentText, rating, isAnonymous },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ message: 'Komenti nuk u gjet' });
    }

    res.status(200).json({ message: 'Komenti u përditësua me sukses', comment: updatedComment });
  } catch (err) {
    res.status(500).json({ message: 'Gabim gjatë përditësimit të komenteve' });
  }
});
// DELETE - Fshi një koment
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Komenti u fshi me sukses' });
  } catch (err) {
    res.status(500).json({ message: 'Gabim gjatë fshirjes së komenteve' });
  }
});

module.exports = router;
