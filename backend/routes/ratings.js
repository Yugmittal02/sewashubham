const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.post('/', ratingController.submitRating);
router.get('/product/:productId', ratingController.getProductRatings);
router.get('/all', ratingController.getAllRatings); // Unlocked for development

module.exports = router;
