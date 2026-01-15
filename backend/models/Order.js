const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        quantity: { type: Number, required: true },
        size: String,
        addons: [String],
        price: Number // Price tracking at time of order
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: { type: String, enum: ['Cash', 'Online'], default: 'Cash' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
    deliveryAddress: {
        address: String,
        landmark: String,
        pincode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    customerNote: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
