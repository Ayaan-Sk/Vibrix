const express = require('express');
const router = express.Router();
const dismissalController = require('../controllers/dismissal.controller');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, dismissalController.dismissNotice);

module.exports = router;
