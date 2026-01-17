const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, optionalVerifyToken, isAdmin } = require('../middleware/authMiddleware');
const { validateOrder, validateObjectId } = require('../middleware/validation');

// Guest order creation (no auth required, but validated, checks for token optionally)
router.post('/', optionalVerifyToken, validateOrder, orderController.createOrder);
router.get('/track/:id', validateObjectId('id'), orderController.trackOrder);

// Authenticated routes
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/all', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, ...validateObjectId('id'), orderController.updateOrderStatus);
router.put('/:id/accept', verifyToken, isAdmin, ...validateObjectId('id'), orderController.acceptOrder);

module.exports = router;

