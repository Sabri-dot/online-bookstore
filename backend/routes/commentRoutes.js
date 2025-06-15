const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/:bookId', commentController.getComments);
router.post('/', authMiddleware, commentController.addComment);
router.put('/:commentId', authMiddleware, commentController.editComment);

module.exports = router;
