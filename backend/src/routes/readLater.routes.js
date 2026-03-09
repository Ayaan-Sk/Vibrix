const express = require('express');
const router = express.Router();
const readLaterController = require('../controllers/readLater.controller');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, readLaterController.getReadLater);
router.get('/count', verifyToken, readLaterController.getUnreadCount);
router.post('/', verifyToken, readLaterController.saveReadLater);
router.patch('/:notice_id/read', verifyToken, readLaterController.markAsRead);
router.delete('/:notice_id', verifyToken, readLaterController.removeReadLater);
router.delete('/', verifyToken, readLaterController.clearReadItems);

module.exports = router;
