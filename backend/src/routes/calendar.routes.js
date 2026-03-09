const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const { verifyToken } = require('../middleware/auth');
const { requireAdminOrFaculty } = require('../middleware/role');

router.get('/', verifyToken, calendarController.getEvents);
router.get('/upcoming', verifyToken, calendarController.getUpcomingEvents);
router.get('/export', verifyToken, calendarController.exportICS);

router.post('/', verifyToken, requireAdminOrFaculty, calendarController.createEvent);
router.put('/:id', verifyToken, requireAdminOrFaculty, calendarController.updateEvent);
router.delete('/:id', verifyToken, requireAdminOrFaculty, calendarController.deleteEvent);
router.post('/from-notice', verifyToken, requireAdminOrFaculty, calendarController.createFromNotice);

module.exports = router;
