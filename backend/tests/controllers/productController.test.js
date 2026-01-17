const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const productRouter = require('../../routes/products');
const Product = require('../../models/Product');
const User = require('../../models/User');
const testDb = require('../utils/testDb');

// Create a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/products', productRouter);

describe('Product Controller Tests', () => {
  let adminToken;
  let adminUser;

  beforeAll(async () => {
    await testDb.connect();
    
    // Create admin user for auth tests
    adminUser = new User({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin'
    });
    await adminUser.save();
    
    adminToken = jwt.sign(
      { userId: adminUser._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  });

  afterAll(async () => {
    await testDb.closeDatabase();
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  describe('GET /api/products - Get All Products', () => {
    it('should return all products', async () => {
      const products = [
        { name: 'Chocolate Cake', category: 'Cakes', basePrice: 500, description: 'Delicious chocolate cake' },
        { name: 'Vanilla Cupcake', category: 'Cupcakes', basePrice: 50, description: 'Tasty cupcake' }
      ];
      
      await Product.insertMany(products);

      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Vanilla Cupcake'); // sorted by createdAt desc
    });

    it('should filter products by category', async () => {
      const products = [
        { name: 'Chocolate Cake', category: 'Cakes', basePrice: 500 },
        { name: 'Vanilla Cupcake', category: 'Cupcakes', basePrice: 50 }
      ];
      
      await Product.insertMany(products);

      const response = await request(app)
        .get('/api/products?category=Cakes')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].category).toBe('Cakes');
    });

    it('should return empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/products')
        .expect(200);

      expect(response.body).toHaveLength(0);
    });
  });

  describe('GET /api/products/:id - Get Product By ID', () => {
    it('should return a product by ID', async () => {
      const product = await Product.create({
        name: 'Red Velvet Cake',
        category: 'Cakes',
        basePrice: 600
      });

      const response = await request(app)
        .get(`/api/products/${product._id}`)
        .expect(200);

      expect(response.body.name).toBe('Red Velvet Cake');
      expect(response.body.basePrice).toBe(600);
    });

    it('should return 404 for non-existent product', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      const response = await request(app)
        .get(`/api/products/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Product not found');
    });
  });

  describe('POST /api/products - Create Product (Admin Only)', () => {
    it('should create a product with valid data and admin token', async () => {
      const productData = {
        name: 'Strawberry Cake',
        category: 'Cakes',
        basePrice: 550,
        description: 'Fresh strawberry cake',
        sizes: [
          { name: '1kg', price: 550 },
          { name: '2kg', price: 1000 }
        ]
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(productData)
        .expect(201);

      expect(response.body.name).toBe(productData.name);
      expect(response.body.sizes).toHaveLength(2);
    });

    it('should fail without authentication', async () => {
      const productData = {
        name: 'Strawberry Cake',
        category: 'Cakes',
        basePrice: 550
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(401);

      expect(response.body.message).toBe('No token provided');
    });
  });

  describe('PUT /api/products/:id - Update Product (Admin Only)', () => {
    it('should update a product with admin token', async () => {
      const product = await Product.create({
        name: 'Old Name',
        category: 'Cakes',
        basePrice: 500
      });

      const updates = {
        name: 'Updated Name',
        basePrice: 600
      };

      const response = await request(app)
        .put(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe('Updated Name');
      expect(response.body.basePrice).toBe(600);
    });
  });

  describe('DELETE /api/products/:id - Delete Product (Admin Only)', () => {
    it('should delete a product with admin token', async () => {
      const product = await Product.create({
        name: 'To Delete',
        category: 'Cakes',
        basePrice: 500
      });

      await request(app)
        .delete(`/api/products/${product._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const found = await Product.findById(product._id);
      expect(found).toBeNull();
    });
  });

  describe('PATCH /api/products/:id/toggle-availability - Toggle Availability', () => {
    it('should toggle product availability', async () => {
      const product = await Product.create({
        name: 'Test Product',
        category: 'Cakes',
        basePrice: 500,
        isAvailable: true
      });

      const response = await request(app)
        .patch(`/api/products/${product._id}/toggle-availability`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.isAvailable).toBe(false);

      // Toggle back
      const response2 = await request(app)
        .patch(`/api/products/${product._id}/toggle-availability`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response2.body.isAvailable).toBe(true);
    });
  });
});
