const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteController');

router.get('/categories', quoteController.getCategories);

module.exports = router;
