const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/setup', profileController.setupProfile);
router.get('/all', profileController.getUsers);

module.exports = router;
