const Rating = require('../models/Rating');
const Product = require('../models/Product');

exports.submitRating = async (req, res) => {
    try {
        const { orderId, productId, customer, rating, comment } = req.body;
        
        const newRating = new Rating({
            order: orderId,
            product: productId,
            customer,
            rating,
            comment
        });
        await newRating.save();
        
        // Update product average rating
        const product = await Product.findById(productId);
        if (product) {
            const newCount = product.ratingCount + 1;
            const newAvg = ((product.rating * product.ratingCount) + rating) / newCount;
            product.rating = Math.round(newAvg * 10) / 10;
            product.ratingCount = newCount;
            await product.save();
        }
        
        res.status(201).json({ message: 'Rating submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting rating', error: error.message });
    }
};

exports.getProductRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({ product: req.params.productId })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ratings' });
    }
};

exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find()
            .populate('product', 'name')
            .sort({ createdAt: -1 });
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ratings' });
    }
};
