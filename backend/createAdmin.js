const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sewashubham')
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// User Schema (inline for simplicity)
const userSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: { type: String, unique: true, sparse: true },
    password: String,
    role: { type: String, default: 'customer' },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
    try {
        // Check if admin exists
        const existing = await User.findOne({ email: 'elytronways@gmail.com' });
        if (existing) {
            console.log('Admin already exists!');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('opaltiming', 10);

        // Create admin
        const admin = new User({
            name: 'Admin',
            email: 'elytronways@gmail.com',
            password: hashedPassword,
            phone: '9999999999',
            role: 'admin'
        });

        await admin.save();
        console.log('✅ Admin user created successfully!');
        console.log('Email: elytronways@gmail.com');
        console.log('Password: opaltiming');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
