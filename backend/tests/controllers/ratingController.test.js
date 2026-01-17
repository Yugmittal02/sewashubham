const request = require('supertest');
const express = require('express');
const ratingRouter = require('../../routes/ratings');
const Rating = require('../../models/Rating');
const testDb = require('../utils/testDb');

// Create a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/ratings', ratingRouter);

describe('Rating Controller Tests', () => {
  beforeAll(async () => {
    await testDb.connect();
  });

  afterAll(async () => {
    await testDb.closeDatabase();
  });

  afterEach(async () => {
    await Rating.deleteMany({});
  });

  describe('POST /api/ratings - Submit Rating', () => {
    it('should create a new rating', async () => {
      const ratingData = {
        customerName: 'John Doe',
        rating: 5,
        comment: 'Excellent service!'
      };

      const response = await request(app)
        .post('/api/ratings')
        .send(ratingData)
        .expect(201);

      expect(response.body.customerName).toBe('John Doe');
      expect(response.body.rating).toBe(5);
      expect(response.body.comment).toBe('Excellent service!');
    });

    it('should create rating without comment', async () => {
      const ratingData = {
        customerName: 'Jane Doe',
        rating: 4
      };

      const response = await request(app)
        .post('/api/ratings')
        .send(ratingData)
        .expect(201);

      expect(response.body.rating).toBe(4);
    });
  });

  describe('GET /api/ratings - Get All Ratings', () => {
    it('should return all ratings sorted by date', async () => {
      await Rating.insertMany([
        { customerName: 'User 1', rating: 5, comment: 'Great!' },
        { customerName: 'User 2', rating: 4, comment: 'Good' },
        { customerName: 'User 3', rating: 3, comment: 'Ok' }
      ]);

      const response = await request(app)
        .get('/api/ratings')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0].customerName).toBe('User 3'); // Latest first
    });

    it('should return empty array when no ratings exist', async () => {
      const response = await request(app)
        .get('/api/ratings')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });
});
