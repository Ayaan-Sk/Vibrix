const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.get('/', verifyToken, requireAdmin, userController.getUsers);
router.post('/', verifyToken, requireAdmin, userController.createUser);
router.put('/:id', verifyToken, requireAdmin, userController.updateUser);
router.delete('/:id', verifyToken, requireAdmin, userController.deactivateUser);

module.exports = router;
