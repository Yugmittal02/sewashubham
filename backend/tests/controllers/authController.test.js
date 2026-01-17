const request = require('supertest');
const express = require('express');
const authRouter = require('../../routes/auth');
const User = require('../../models/User');
const testDb = require('../utils/testDb');

// Create a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Controller Tests', () => {
  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.closeDatabase();
  });

  afterEach(async () => {
    await testDb.clearDatabase();
  });

  describe('POST /api/auth/customer - Customer Registration', () => {
    it('should register a new customer with valid data', async () => {
      const customerData = {
        name: 'John Doe',
        phone: '9876543210'
      };

      const response = await request(app)
        .post('/api/auth/customer')
        .send(customerData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe(customerData.name);
      expect(response.body.user.phone).toBe(customerData.phone);
      expect(response.body.user.role).toBe('customer');
      expect(response.body.message).toBe('Welcome!');
    });

    it('should return existing customer if phone already exists', async () => {
      const customerData = {
        name: 'Jane Doe',
        phone: '9876543211'
      };

      // Register first time
      await request(app)
        .post('/api/auth/customer')
        .send(customerData)
        .expect(201);

      // Register second time with same phone
      const response = await request(app)
        .post('/api/auth/customer')
        .send(customerData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Welcome back!');
    });

    it('should fail if name is missing', async () => {
      const response = await request(app)
        .post('/api/auth/customer')
        .send({ phone: '9876543212' })
        .expect(400);

      expect(response.body.message).toBe('Name and phone are required');
    });

    it('should fail if phone is missing', async () => {
      const response = await request(app)
        .post('/api/auth/customer')
        .send({ name: 'Test User' })
        .expect(400);

      expect(response.body.message).toBe('Name and phone are required');
    });
  });

  describe('POST /api/auth/admin/login - Admin Login', () => {
    beforeEach(async () => {
      // Create an admin user before each test
      const admin = new User({
        name: 'Admin User',
        email: 'admin@sewashubham.com',
        password: 'admin123',
        phone: '1234567890',
        role: 'admin'
      });
      await admin.save();
    });

    it('should login admin with correct credentials', async () => {
      const loginData = {
        email: 'admin@sewashubham.com',
        password: 'admin123'
      };

      const response = await request(app)
        .post('/api/auth/admin/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
      expect(response.body.user.role).toBe('admin');
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should fail with incorrect password', async () => {
      const loginData = {
        email: 'admin@sewashubham.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/auth/admin/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail with non-existent email', async () => {
      const loginData = {
        email: 'nonexistent@sewashubham.com',
        password: 'admin123'
      };

      const response = await request(app)
        .post('/api/auth/admin/login')
        .send(loginData)
        .expect(400);

      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should fail with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({ password: 'admin123' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should fail with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/admin/login')
        .send({ email: 'admin@sewashubham.com' })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });
});
