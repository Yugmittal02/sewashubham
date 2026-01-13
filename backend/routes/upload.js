const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_CLOUD_NAME || 
            process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name' ||
            !process.env.CLOUDINARY_API_KEY ||
            process.env.CLOUDINARY_API_KEY === 'your_api_key') {
            return res.status(500).json({ 
                message: 'Cloudinary not configured. Please add your credentials to .env file.' 
            });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Convert buffer to base64
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64Image, {
            folder: 'sewashubham-bakery',
            resource_type: 'image',
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        res.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
});

// Delete image from Cloudinary
router.delete('/delete/:publicId', async (req, res) => {
    try {
        const { publicId } = req.params;
        await cloudinary.uploader.destroy(`sewashubham-bakery/${publicId}`);
        res.json({ success: true, message: 'Image deleted' });
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        res.status(500).json({ message: 'Image deletion failed', error: error.message });
    }
});

module.exports = router;
