const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const orderRouter = require('../../routes/orders');
const Order = require('../../models/Order');
const User = require('../../models/User');
const testDb = require('../utils/testDb');

// Create a minimal Express app for testing
const app = express();
app.use(express.json());
app.use('/api/orders', orderRouter);

describe('Order Controller Tests', () => {
  let adminToken;
  let customerToken;
  let customerId;
  let adminId;

  beforeAll(async () => {
    await testDb.connect();
    
    // Create customer user
    const customer = new User({
      name: 'Customer',
      phone: '9876543210',
      role: 'customer'
    });
    await customer.save();
    customerId = customer._id;
    
    customerToken = jwt.sign(
      { userId: customer._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );
    
    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@test.com',
      password: 'admin123',
      phone: '1234567890',
      role: 'admin'
    });
    await admin.save();
    adminId = admin._id;
    
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
    await Order.deleteMany({});
  });

  describe('POST /api/orders - Create Order', () => {
    it('should create an order for authenticated customer', async () => {
      const orderData = {
        items: [
          {
            name: 'Chocolate Cake',
            quantity: 2,
            price: 500,
            size: '1kg'
          }
        ],
        totalAmount: 1000,
        paymentMethod: 'Cash',
        customerNote: 'Please deliver by evening'
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.totalAmount).toBe(1000);
      expect(response.body.items).toHaveLength(1);
      expect(response.body.status).toBe('Pending');
    });

    it('should create an order with all new fields', async () => {
      const orderData = {
        items: [
          { name: 'Pizza', quantity: 1, price: 350, size: 'Large', addons: ['Extra Cheese'] }
        ],
        totalAmount: 500,
        paymentMethod: 'UPI',
        orderType: 'Delivery',
        deliveryAddress: {
          address: '123 Main St, Delhi',
          manualAddress: 'Near Metro Station',
          landmark: 'Blue Gate',
          coordinates: { lat: 28.6139, lng: 77.2090 }
        },
        donationAmount: 10,
        appliedOffer: {
          code: 'SAVE10',
          discountAmount: 35
        },
        deliveryFee: 40,
        platformFee: 0.98,
        taxAmount: 17.5
      };

      const response = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .send(orderData)
        .expect(201);

      expect(response.body.orderType).toBe('Delivery');
      expect(response.body.donationAmount).toBe(10);
      expect(response.body.deliveryFee).toBe(40);
      expect(response.body.platformFee).toBe(0.98);
      expect(response.body.taxAmount).toBe(17.5);
      expect(response.body.deliveryAddress.landmark).toBe('Blue Gate');
    });

    it('should create an order with online payment method', async () => {
      const orderData = {
        user: customerId,
        items: [{ name: 'Cupcake', quantity: 4, price: 50 }],
        totalAmount: 200,
        paymentMethod: 'Online'
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(response.body.paymentMethod).toBe('Online');
    });

    it('should default isAccepted to false', async () => {
      const orderData = {
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500
      };

      const response = await request(app)
        .post('/api/orders')
        .send(orderData)
        .expect(201);

      expect(response.body.isAccepted).toBe(false);
    });
  });

  describe('GET /api/orders/my-orders - Get User Orders', () => {
    it('should return orders for authenticated user', async () => {
      // Create orders for customer
      await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500
      });
      
      await Order.create({
        user: customerId,
        items: [{ name: 'Cake 2', quantity: 1, price: 600 }],
        totalAmount: 600
      });

      const response = await request(app)
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/orders/all - Get All Orders (Admin)', () => {
    it('should return all orders for admin', async () => {
      await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500
      });

      const response = await request(app)
        .get('/api/orders/all')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].user.name).toBe('Customer');
    });

    it('should reject non-admin users', async () => {
      await request(app)
        .get('/api/orders/all')
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });
  });

  describe('GET /api/orders/track/:id - Track Order', () => {
    it('should track order by ID with full details', async () => {
      const order = await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500,
        status: 'Preparing',
        orderType: 'Delivery',
        deliveryFee: 30,
        platformFee: 0.98,
        taxAmount: 25,
        donationAmount: 5
      });

      const response = await request(app)
        .get(`/api/orders/track/${order._id}`)
        .expect(200);

      expect(response.body.status).toBe('Preparing');
      expect(response.body.totalAmount).toBe(500);
      expect(response.body.orderType).toBe('Delivery');
      expect(response.body.deliveryFee).toBe(30);
      expect(response.body.donationAmount).toBe(5);
      expect(response.body).toHaveProperty('isAccepted');
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .get(`/api/orders/track/${fakeId}`)
        .expect(404);
    });
  });

  describe('PUT /api/orders/:id/status - Update Order Status (Admin)', () => {
    it('should update order status', async () => {
      const order = await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500
      });

      const response = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Ready' })
        .expect(200);

      expect(response.body.status).toBe('Ready');
    });

    it('should update status through full flow', async () => {
      const order = await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500
      });

      // Pending -> Preparing
      await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Preparing' })
        .expect(200);

      // Preparing -> Ready
      await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Ready' })
        .expect(200);

      // Ready -> Delivered
      const response = await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Delivered' })
        .expect(200);

      expect(response.body.status).toBe('Delivered');
    });

    it('should reject non-admin users', async () => {
      const order = await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500
      });

      await request(app)
        .put(`/api/orders/${order._id}/status`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ status: 'Ready' })
        .expect(403);
    });
  });

  describe('PUT /api/orders/:id/accept - Accept Order (Admin)', () => {
    it('should accept a pending order', async () => {
      const order = await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500,
        status: 'Pending',
        isAccepted: false
      });

      const response = await request(app)
        .put(`/api/orders/${order._id}/accept`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.isAccepted).toBe(true);
      expect(response.body.status).toBe('Preparing');
      expect(response.body).toHaveProperty('acceptedAt');
    });

    it('should reject non-admin users', async () => {
      const order = await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500
      });

      await request(app)
        .put(`/api/orders/${order._id}/accept`)
        .set('Authorization', `Bearer ${customerToken}`)
        .expect(403);
    });

    it('should return 404 for non-existent order', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      
      await request(app)
        .put(`/api/orders/${fakeId}/accept`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });

  describe('Order Status Flow Validation', () => {
    it('should set acceptedAt timestamp when accepting', async () => {
      const order = await Order.create({
        user: customerId,
        items: [{ name: 'Cake', quantity: 1, price: 500 }],
        totalAmount: 500
      });

      const beforeAccept = new Date();

      const response = await request(app)
        .put(`/api/orders/${order._id}/accept`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      const acceptedAt = new Date(response.body.acceptedAt);
      expect(acceptedAt.getTime()).toBeGreaterThanOrEqual(beforeAccept.getTime());
    });
  });
});
