const request = require('supertest');
const express = require('express');
const settingsRouter = require('../../routes/settings');
const Settings = require('../../models/Settings');
const testDb = require('../utils/testDb');

// Create a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/settings', settingsRouter);

describe('Settings Controller Tests', () => {
  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.closeDatabase();
  });

  afterEach(async () => {
    await testDb.clearDatabase();
  });

  describe('GET /api/settings/fees - Get Fee Settings', () => {
    it('should return default fee settings when none exist', async () => {
      const response = await request(app)
        .get('/api/settings/fees')
        .expect(200);

      expect(response.body).toHaveProperty('platformFee');
      expect(response.body).toHaveProperty('taxRate');
      expect(response.body).toHaveProperty('deliveryFeeBase');
      expect(response.body).toHaveProperty('deliveryFeePerKm');
      expect(response.body).toHaveProperty('freeDeliveryThreshold');
      expect(response.body).toHaveProperty('deliveryRadiusKm');
      expect(response.body).toHaveProperty('storeLocation');
    });

    it('should return existing fee settings', async () => {
      // Create fee settings first
      await Settings.create({
        key: 'fee_config',
        platformFee: 5.99,
        taxRate: 10,
        deliveryFeeBase: 40,
        deliveryFeePerKm: 8,
        freeDeliveryThreshold: 600,
        deliveryRadiusKm: 15,
        storeLocation: { lat: 28.5, lng: 77.3 }
      });

      const response = await request(app)
        .get('/api/settings/fees')
        .expect(200);

      expect(response.body.platformFee).toBe(5.99);
      expect(response.body.taxRate).toBe(10);
      expect(response.body.deliveryFeeBase).toBe(40);
    });
  });

  describe('PUT /api/settings/fees - Update Fee Settings', () => {
    beforeEach(async () => {
      // Create initial settings with password
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('testpassword123', 10);
      await Settings.create({
        key: 'fee_config',
        settingsPassword: hashedPassword,
        platformFee: 0.98,
        taxRate: 5
      });
    });

    it('should update fee settings with correct password', async () => {
      const updateData = {
        platformFee: 1.50,
        taxRate: 8,
        deliveryFeeBase: 35,
        password: 'testpassword123'
      };

      const response = await request(app)
        .put('/api/settings/fees')
        .send(updateData)
        .expect(200);

      expect(response.body.platformFee).toBe(1.50);
      expect(response.body.taxRate).toBe(8);
    });

    it('should fail with incorrect password', async () => {
      const updateData = {
        platformFee: 1.50,
        password: 'wrongpassword'
      };

      const response = await request(app)
        .put('/api/settings/fees')
        .send(updateData)
        .expect(401);

      expect(response.body.message).toBe('Invalid password');
    });

    it('should fail without password', async () => {
      const updateData = {
        platformFee: 1.50
      };

      const response = await request(app)
        .put('/api/settings/fees')
        .send(updateData)
        .expect(400);

      expect(response.body.message).toBe('Password is required');
    });
  });

  describe('POST /api/settings/calculate-delivery - Delivery Fee Calculation', () => {
    beforeEach(async () => {
      // Set up fee config with store location
      await Settings.create({
        key: 'fee_config',
        deliveryFeeBase: 30,
        deliveryFeePerKm: 5,
        freeDeliveryThreshold: 500,
        deliveryRadiusKm: 10,
        storeLocation: { lat: 28.6139, lng: 77.2090 } // Delhi
      });
    });

    it('should calculate delivery fee for nearby location', async () => {
      const response = await request(app)
        .post('/api/settings/calculate-delivery')
        .send({
          customerLat: 28.6200,
          customerLng: 77.2100,
          orderTotal: 300
        })
        .expect(200);

      expect(response.body).toHaveProperty('deliveryFee');
      expect(response.body).toHaveProperty('distance');
      expect(response.body.withinRadius).toBe(true);
    });

    it('should return free delivery when order exceeds threshold', async () => {
      const response = await request(app)
        .post('/api/settings/calculate-delivery')
        .send({
          customerLat: 28.6200,
          customerLng: 77.2100,
          orderTotal: 600 // Above 500 threshold
        })
        .expect(200);

      expect(response.body.deliveryFee).toBe(0);
      expect(response.body.freeDelivery).toBe(true);
    });

    it('should indicate when location is outside delivery radius', async () => {
      const response = await request(app)
        .post('/api/settings/calculate-delivery')
        .send({
          customerLat: 28.8000, // Far away
          customerLng: 77.4000,
          orderTotal: 300
        })
        .expect(200);

      expect(response.body.withinRadius).toBe(false);
    });

    it('should fail with missing coordinates', async () => {
      const response = await request(app)
        .post('/api/settings/calculate-delivery')
        .send({
          orderTotal: 300
        })
        .expect(400);

      expect(response.body.message).toBe('Customer coordinates are required');
    });
  });

  describe('GET /api/settings/store - Get Store Settings', () => {
    it('should return default store settings when none exist', async () => {
      const response = await request(app)
        .get('/api/settings/store')
        .expect(200);

      expect(response.body).toHaveProperty('adminPhone');
    });

    it('should return existing store settings', async () => {
      await Settings.create({
        key: 'store_config',
        adminPhone: '9876543210'
      });

      const response = await request(app)
        .get('/api/settings/store')
        .expect(200);

      expect(response.body.adminPhone).toBe('9876543210');
    });
  });

  describe('PUT /api/settings/store - Update Store Settings', () => {
    beforeEach(async () => {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('storepass123', 10);
      await Settings.create({
        key: 'store_config',
        settingsPassword: hashedPassword,
        adminPhone: '1234567890'
      });
    });

    it('should update store settings with correct password', async () => {
      const response = await request(app)
        .put('/api/settings/store')
        .send({
          adminPhone: '9876543210',
          password: 'storepass123'
        })
        .expect(200);

      expect(response.body.adminPhone).toBe('9876543210');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .put('/api/settings/store')
        .send({
          adminPhone: '9876543210',
          password: 'wrongpass'
        })
        .expect(401);

      expect(response.body.message).toBe('Invalid password');
    });
  });

  describe('GET /api/settings/upi - Get UPI Settings', () => {
    it('should return UPI configuration status', async () => {
      const response = await request(app)
        .get('/api/settings/upi')
        .expect(200);

      expect(response.body).toHaveProperty('isConfigured');
    });
  });
});
