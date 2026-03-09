const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/notice.controller');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin, requireAdminOrFaculty } = require('../middleware/role');

router.get('/', verifyToken, noticeController.getNotices);
router.get('/startup', verifyToken, noticeController.getStartupNotices);
router.get('/pinned', verifyToken, noticeController.getPinnedNotices);
router.get('/urgent', verifyToken, noticeController.getUrgentCount);
router.get('/:id', verifyToken, noticeController.getNoticeById);

router.post('/', verifyToken, requireAdminOrFaculty, noticeController.createNotice);
router.put('/:id', verifyToken, requireAdminOrFaculty, noticeController.updateNotice);
router.delete('/:id', verifyToken, requireAdminOrFaculty, noticeController.deleteNotice);

router.patch('/:id/pin', verifyToken, requireAdmin, noticeController.togglePin);
router.patch('/:id/startup-notification', verifyToken, requireAdmin, noticeController.toggleStartup);

module.exports = router;
