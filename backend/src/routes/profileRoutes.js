const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');

router.post('/setup', auth, profileController.setupProfile);
router.get('/get', auth, profileController.getProfile);

module.exports = router;
