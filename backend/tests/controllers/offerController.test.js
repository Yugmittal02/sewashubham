const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const offerRouter = require('../../routes/offers');
const Offer = require('../../models/Offer');
const User = require('../../models/User');
const testDb = require('../utils/testDb');

// Create a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/offers', offerRouter);

describe('Offer Controller Tests', () => {
  let adminToken;

  beforeAll(async () => {
    await testDb.connect();
    
    const admin = new User({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin'
    });
    await admin.save();
    
    adminToken = jwt.sign(
      { userId: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

  afterAll(async () => {
    await testDb.closeDatabase();
  });

  afterEach(async () => {
    await Offer.deleteMany({});
  });

  describe('GET /api/offers - Get All Offers', () => {
    it('should return all offers', async () => {
      await Offer.insertMany([
        { title: 'Buy 1 Get 1', description: 'On all cakes', discount: 50, isActive: true },
        { title: '20% Off', description: 'On cupcakes', discount: 20, isActive: false }
      ]);

      const response = await request(app)
        .get('/api/offers')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/offers/active - Get Active Offers', () => {
    it('should return only active offers', async () => {
      await Offer.insertMany([
        { title: 'Active Offer', description: 'Active', discount: 30, isActive: true },
        { title: 'Inactive Offer', description: 'Inactive', discount: 20, isActive: false }
      ]);

      const response = await request(app)
        .get('/api/offers/active')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].isActive).toBe(true);
    });
  });

  describe('POST /api/offers - Create Offer (Admin)', () => {
    it('should create an offer with admin token', async () => {
      const offerData = {
        title: 'New Year Special',
        description: '30% off on all items',
        discount: 30,
        isActive: true
      };

      const response = await request(app)
        .post('/api/offers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(offerData)
        .expect(201);

      expect(response.body.title).toBe('New Year Special');
      expect(response.body.discount).toBe(30);
    });
  });

  describe('PUT /api/offers/:id - Update Offer (Admin)', () => {
    it('should update an offer', async () => {
      const offer = await Offer.create({
        title: 'Old Title',
        description: 'Old desc',
        discount: 10,
        isActive: false
      });

      const response = await request(app)
        .put(`/api/offers/${offer._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated Title', isActive: true })
        .expect(200);

      expect(response.body.title).toBe('Updated Title');
      expect(response.body.isActive).toBe(true);
    });
  });

  describe('DELETE /api/offers/:id - Delete Offer (Admin)', () => {
    it('should delete an offer', async () => {
      const offer = await Offer.create({
        title: 'To Delete',
        description: 'Will be deleted',
        discount: 15
      });

      await request(app)
        .delete(`/api/offers/${offer._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const found = await Offer.findById(offer._id);
      expect(found).toBeNull();
    });
  });
});
