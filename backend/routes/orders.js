const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { optionalVerifyToken } = require('../middleware/authMiddleware');
const { validateOrder, validateObjectId } = require('../middleware/validation');

// Guest order creation (no auth required, but validated, checks for token optionally)
router.post('/', optionalVerifyToken, validateOrder, orderController.createOrder);
router.get('/track/:id', validateObjectId('id'), orderController.trackOrder);

// Admin routes - unlocked for development
router.get('/my-orders', orderController.getUserOrders);
router.get('/all', orderController.getAllOrders);
router.put('/:id/status', validateObjectId('id'), orderController.updateOrderStatus);
router.put('/:id/accept', validateObjectId('id'), orderController.acceptOrder);

// Cancel order (customer can cancel within 30 seconds)
router.put('/:id/cancel', validateObjectId('id'), orderController.cancelOrder);

// Payment screenshot upload (customer - no auth required, uses order ID)
router.put('/:id/screenshot', validateObjectId('id'), orderController.uploadPaymentScreenshot);

// Admin: Verify payment screenshot - unlocked for development
router.put('/:id/verify-payment', validateObjectId('id'), orderController.verifyPaymentScreenshot);

module.exports = router;


