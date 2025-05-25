const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware'); // për JWT verifikim

// Lexo librat (publik)
router.get('/', bookController.getAllBooks);

// Merr libër sipas id (publik)
router.get('/:id', bookController.getBookById);

// Shto libër (duhet të jesh i loguar)
router.post('/', authMiddleware, bookController.createBook);

// Përditëso libër (duhet të jesh i loguar)
router.put('/:id', authMiddleware, bookController.updateBook);

// Fshi libër (duhet të jesh i loguar)
router.delete('/:id', authMiddleware, bookController.deleteBook);

module.exports = router;
