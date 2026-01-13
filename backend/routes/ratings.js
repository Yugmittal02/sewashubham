const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', ratingController.submitRating);
router.get('/product/:productId', ratingController.getProductRatings);
router.get('/all', verifyToken, isAdmin, ratingController.getAllRatings);

module.exports = router;
