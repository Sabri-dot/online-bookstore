const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middlewares/authMiddleware'); // JWT verifikim
const upload = require('../middlewares/uploadMiddleware'); // multer për upload

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

// Download PDF i librit (publik)
router.get('/download/:id', bookController.downloadBookPdf);

// Upload PDF për libër (duhet të jesh i loguar)
router.post('/upload-pdf/:id', authMiddleware, upload.single('pdf'), bookController.uploadBookPdf);

module.exports = router;
