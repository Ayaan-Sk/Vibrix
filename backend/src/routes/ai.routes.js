const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiController = require('../controllers/ai.controller');
const { verifyToken } = require('../middleware/auth');
const { requireAdminOrFaculty } = require('../middleware/role');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-image', verifyToken, requireAdminOrFaculty, upload.single('image'), aiController.uploadImage);
router.post('/process-image', verifyToken, requireAdminOrFaculty, aiController.processImage);
router.post('/translate', verifyToken, aiController.translateNotice);

module.exports = router;
