const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const bcrypt = require('bcryptjs');

// Default settings password (should be changed on first setup)
const DEFAULT_PASSWORD = 'admin123';

// Initialize or get settings by key
const getOrCreateSettings = async (key = 'upi_config') => {
    let settings = await Settings.findOne({ key });
    if (!settings) {
        // Create default settings with default password
        const salt = await bcrypt.genSalt(10);
        const settingsPassword = await bcrypt.hash(DEFAULT_PASSWORD, salt);
        
        settings = await Settings.create({
            key,
            upiId: key === 'upi_config' ? '' : undefined,
            merchantName: key === 'upi_config' ? 'Store' : undefined,
            adminPhone: key === 'store_config' ? '9876543210' : undefined,
            settingsPassword,
            updatedBy: 'system'
        });
    }
    return settings;
};

// GET /api/settings/upi - Get current UPI config (public)
router.get('/upi', async (req, res) => {
    try {
        const settings = await getOrCreateSettings('upi_config');
        res.json({
            upiId: settings.upiId,
            merchantName: settings.merchantName,
            isConfigured: settings.upiId && settings.upiId.includes('@'),
            updatedAt: settings.updatedAt
        });
    } catch (error) {
        console.error('Error fetching UPI settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/settings/upi/admin - Get UPI config for admin (shows masked ID)
router.get('/upi/admin', async (req, res) => {
    try {
        const settings = await getOrCreateSettings('upi_config');
        
        // Mask the UPI ID for display (e.g., "ayu***@upi")
        let maskedUpiId = '';
        if (settings.upiId) {
            const [name, handle] = settings.upiId.split('@');
            if (name && handle) {
                const maskedName = name.substring(0, 3) + '***';
                maskedUpiId = `${maskedName}@${handle}`;
            } else {
                maskedUpiId = '***';
            }
        }
        
        res.json({
            upiId: settings.upiId,
            maskedUpiId: maskedUpiId,
            merchantName: settings.merchantName,
            isConfigured: settings.upiId && settings.upiId.includes('@'),
            updatedAt: settings.updatedAt,
            updatedBy: settings.updatedBy
        });
    } catch (error) {
        console.error('Error fetching admin UPI settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/settings/store - Get store config (public)
router.get('/store', async (req, res) => {
    try {
        const settings = await getOrCreateSettings('store_config');
        res.json({
            adminPhone: settings.adminPhone,
            updatedAt: settings.updatedAt
        });
    } catch (error) {
        console.error('Error fetching store settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/settings/verify-password - Verify settings password
router.post('/verify-password', async (req, res) => {
    try {
        const { password, type } = req.body; // type: 'upi' or 'store'
        const key = type === 'store' ? 'store_config' : 'upi_config';
        
        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        const settings = await getOrCreateSettings(key);
        const isMatch = await bcrypt.compare(password, settings.settingsPassword);
        
        res.json({ valid: isMatch });
    } catch (error) {
        console.error('Error verifying password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/settings/upi - Update UPI config (requires password)
router.put('/upi', async (req, res) => {
    try {
        const { upiId, merchantName, password, newPassword } = req.body;
        
        if (!password) {
            return res.status(400).json({ message: 'Settings password is required' });
        }

        const settings = await getOrCreateSettings('upi_config');
        
        // Verify password
        const isMatch = await bcrypt.compare(password, settings.settingsPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect settings password' });
        }

        // Validate UPI ID format
        if (upiId && !upiId.includes('@')) {
            return res.status(400).json({ message: 'Invalid UPI ID format. Must contain @' });
        }

        // Update settings
        if (upiId !== undefined) settings.upiId = upiId.trim();
        if (merchantName !== undefined) settings.merchantName = merchantName.trim();
        settings.updatedAt = new Date();
        settings.updatedBy = 'admin';

        // Update password if provided
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            settings.settingsPassword = await bcrypt.hash(newPassword, salt);
        }

        await settings.save();

        res.json({
            message: 'UPI settings updated successfully',
            upiId: settings.upiId,
            merchantName: settings.merchantName,
            isConfigured: settings.upiId && settings.upiId.includes('@')
        });
    } catch (error) {
        console.error('Error updating UPI settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/settings/store - Update Store config (requires password)
router.put('/store', async (req, res) => {
    try {
        const { adminPhone, password, newPassword } = req.body;
        
        if (!password) {
            return res.status(400).json({ message: 'Settings password is required' });
        }

        const settings = await getOrCreateSettings('store_config');
        
        // Verify password
        const isMatch = await bcrypt.compare(password, settings.settingsPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect settings password' });
        }

        // Update settings
        if (adminPhone !== undefined) settings.adminPhone = adminPhone.trim();
        settings.updatedAt = new Date();
        settings.updatedBy = 'admin';

        // Update password if provided
        if (newPassword) {
            const salt = await bcrypt.genSalt(10);
            settings.settingsPassword = await bcrypt.hash(newPassword, salt);
        }

        await settings.save();

        res.json({
            message: 'Store settings updated successfully',
            adminPhone: settings.adminPhone
        });
    } catch (error) {
        console.error('Error updating Store settings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/settings/change-password - Change settings password
router.put('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword, type } = req.body;
        const key = type === 'store' ? 'store_config' : 'upi_config';
        
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const settings = await getOrCreateSettings(key);
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, settings.settingsPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        // Update password
        const salt = await bcrypt.genSalt(10);
        settings.settingsPassword = await bcrypt.hash(newPassword, salt);
        settings.updatedAt = new Date();
        
        await settings.save();

        res.json({ message: 'Settings password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
