const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getMe);
router.post('/logout', verifyToken, authController.logout);
router.post('/register', verifyToken, requireAdmin, authController.register);

module.exports = router;
