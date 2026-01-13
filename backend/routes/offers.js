const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { validateCoupon, validateObjectId } = require('../middleware/validation');

// Public routes
router.get('/', offerController.getAllOffers);
router.post('/validate', validateCoupon, offerController.validateCoupon);

// Admin routes
router.get('/admin', verifyToken, isAdmin, offerController.getAllOffersAdmin);
router.post('/', verifyToken, isAdmin, offerController.createOffer);
router.put('/:id', verifyToken, isAdmin, ...validateObjectId('id'), offerController.updateOffer);
router.delete('/:id', verifyToken, isAdmin, ...validateObjectId('id'), offerController.deleteOffer);

module.exports = router;
