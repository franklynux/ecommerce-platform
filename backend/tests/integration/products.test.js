import request from 'supertest';
import mongoose from 'mongoose';
import createTestApp from '../testApp.js';
import Product from '../../src/models/Product.js';
import { createTestUser } from '../utils/authHelpers.js';

const app = createTestApp();

describe('Product API', () => {
  let token;

  beforeEach(async () => {
    await Product.deleteMany({});
    const { token: authToken } = await createTestUser();
    token = authToken;
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/products', () => {
    it('returns all products', async () => {
      // Create test product
      await Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 9.99,
        category: 'toys',
        imageUrl: '/test.jpg',
        stock: 10,
      });

      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.products).toHaveLength(1);
      expect(res.body.data.products[0].name).toBe('Test Product');
    });

    it('filters products by category', async () => {
      // Create test products
      await Product.create([
        {
          name: 'Dog Toy',
          description: 'Test Description',
          price: 9.99,
          category: 'toys',
          imageUrl: '/test.jpg',
          stock: 10,
        },
        {
          name: 'Cat Food',
          description: 'Test Description',
          price: 19.99,
          category: 'food',
          imageUrl: '/test.jpg',
          stock: 10,
        },
      ]);

      const res = await request(app)
        .get('/api/products?category=toys')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.products).toHaveLength(1);
      expect(res.body.data.products[0].category).toBe('toys');
    });

    it('handles empty results', async () => {
      const res = await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data.products).toHaveLength(0);
    });
  });
});