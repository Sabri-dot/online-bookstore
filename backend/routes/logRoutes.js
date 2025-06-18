const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { verifyToken, verifyAdmin } = require('../middlewares/verifyToken');

// Merr të gjitha logjet (vetëm admin)
router.get('/', verifyToken, verifyAdmin, logController.getLogs);

// Shton log manualisht (vetëm admin)
router.post('/', verifyToken, verifyAdmin, logController.addLog);
// Perditeso log (vetem admin)
router.put('/:id', verifyToken, verifyAdmin, logController.updateLog);

// Fshin log me ID (vetëm admin)
router.delete('/:id', verifyToken, verifyAdmin, logController.deleteLog);

module.exports = router;
