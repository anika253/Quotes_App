const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');
const auth = require('../middleware/auth');

router.post('/save', auth, downloadController.saveDownload);
router.get('/history', auth, downloadController.getUserDownloads);

module.exports = router;
