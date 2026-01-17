const Order = require('../models/Order');
const User = require('../models/User');

// Create order (for customers - can be guest or logged in)
exports.createOrder = async (req, res) => {
    try {
        const { 
            user, items, totalAmount, paymentMethod, orderType, customerNote,
            deliveryAddress, donationAmount, appliedOffer, deliveryFee, platformFee, taxAmount
        } = req.body;
        
        const order = new Order({
            user: req.user ? req.user.userId : user,
            items,
            totalAmount,
            paymentMethod: paymentMethod || 'Cash',
            orderType: orderType || 'Dine-in',
            customerNote,
            deliveryAddress,
            donationAmount: donationAmount || 0,
            appliedOffer,
            deliveryFee: deliveryFee || 0,
            platformFee: platformFee || 0,
            taxAmount: taxAmount || 0
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// Track order status (Public - uses order ID as capability token)
exports.trackOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .select('status isAccepted acceptedAt createdAt paymentMethod paymentStatus totalAmount items orderType deliveryAddress donationAmount appliedOffer deliveryFee platformFee taxAmount')
            .populate('items.product', 'name image');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error tracking order' });
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

// Admin: Accept order
exports.acceptOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { 
                isAccepted: true, 
                acceptedAt: new Date(),
                status: 'Preparing' // Auto-move to Preparing when accepted
            },
            { new: true }
        ).populate('user', 'name phone');
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error accepting order', error: error.message });
    }
};
