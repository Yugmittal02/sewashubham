const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const { validateCoupon, validateObjectId } = require('../middleware/validation');

// Public routes
router.get('/', offerController.getAllOffers);
router.post('/validate', validateCoupon, offerController.validateCoupon);

// Admin routes - unlocked for development
router.get('/admin', offerController.getAllOffersAdmin);
router.post('/', offerController.createOffer);
router.put('/:id', ...validateObjectId('id'), offerController.updateOffer);
router.delete('/:id', ...validateObjectId('id'), offerController.deleteOffer);

module.exports = router;
