const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SettingsSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        enum: ['upi_config', 'store_config']
    },
    // UPI Configuration
    upiId: {
        type: String,
        default: ''
    },
    merchantName: {
        type: String,
        default: 'Store'
    },
    // Store Configuration
    adminPhone: {
        type: String,
        default: '9876543210'
    },
    // Settings password (hashed) - separate from admin login
    settingsPassword: {
        type: String,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        default: 'system'
    }
});



module.exports = mongoose.model('Settings', SettingsSchema);
