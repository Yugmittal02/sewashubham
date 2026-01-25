const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Offer = require('../models/Offer');

dotenv.config({ path: './.env' });

const offers = [
    {
        title: "Republic Combo 1",
        description: "Paneer Pizza + 1 Soft Drink (750ml)",
        image: "", // CSS gradient will handle this
        discountType: "flat",
        discountValue: 160,
        code: "REP26A",
        minOrderValue: 0,
        isActive: true,
        validFrom: new Date(),
        validTo: new Date('2026-01-30')
    },
    {
        title: "Republic Combo 2",
        description: "Double Cheese Pizza + 2 Soft Drinks (750ml)",
        image: "", 
        discountType: "flat",
        discountValue: 199,
        code: "REP26B",
        minOrderValue: 0,
        isActive: true,
        validFrom: new Date(),
        validTo: new Date('2026-01-30')
    }
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        try {
            // Delete existing Republic offers if any to avoid duplicates
            await Offer.deleteMany({ code: { $in: ['REP26A', 'REP26B'] } });
            
            await Offer.insertMany(offers);
            console.log('✅ Republic Day offers added successfully');
        } catch (error) {
            console.error('❌ Error adding offers:', error);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => {
        console.error('❌ Database connection error:', err);
    });
