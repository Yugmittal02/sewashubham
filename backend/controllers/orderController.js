const Order = require('../models/Order');
const User = require('../models/User');

// Create order (for customers - can be guest or logged in)
exports.createOrder = async (req, res) => {
    try {
        const { user, items, totalAmount, paymentMethod, orderType, customerNote } = req.body;
        
        const order = new Order({
            user: user, // User ID from frontend
            items,
            totalAmount,
            paymentMethod: paymentMethod || 'Cash',
            customerNote: orderType ? `${orderType}. ${customerNote || ''}` : customerNote
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name phone')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        ).populate('user', 'name phone');
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status' });
    }
};
