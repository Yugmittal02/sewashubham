const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const { validateOrder, validateObjectId } = require('../middleware/validation');

// Guest order creation (no auth required, but validated)
router.post('/', validateOrder, orderController.createOrder);

// Authenticated routes
router.get('/my-orders', verifyToken, orderController.getUserOrders);
router.get('/all', verifyToken, isAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, isAdmin, ...validateObjectId('id'), orderController.updateOrderStatus);

module.exports = router;
