const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Product = require('../models/product.model');
const ShoppingCart = require('../models/cart.model');
const User = require('../models/user.model'); // assuming you have one
const { RedisMemoryServer } = require('redis-memory-server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { redisClient, connectRedis } = require('../config/redis_cache');

const BASE_URL = '/api/v1';

let mongoServer;
let redisServer;
let token;
let userId;
let product;

beforeAll(async () => {
  // redis memory server setup (hardcoded)
  redisServer = new RedisMemoryServer({
    instance: {
        ip: process.env.REDIS_HOST,  
        port: Number(process.env.REDIS_PORT),  
    },
    autoStart: false,
  });
  
  await redisServer.start();
  await connectRedis();

  mongoServer = await require('mongodb-memory-server').MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create test user (register or insert directly)
  const res = await request(app)
    .post(`${BASE_URL}/sign-up`)
    .send({
      username: 'testbuyer',
      email: 'buyer@example.com',
      password: 'password'
    });

  token = res.body.data.token;
  const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
  userId = decoded.id;

  // Create a product
  product = await Product.create({
    name: 'Test Product',
    price: 50,
    stock: 20,
    description: 'Just testing',
    category: 'Test',
    seller: new mongoose.Types.ObjectId()
  });
});

afterEach(async () => {
  await ShoppingCart.deleteMany();
});

afterAll(async () => {
  await Product.deleteMany();
  await mongoose.connection.close();
});

describe('Shopping Cart API', () => {

  test('Add product to cart', async () => {
    const res = await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    expect(res.statusCode).toBe(200);
    expect(res.body.products[0].productId).toBe(product._id.toString());
    expect(res.body.products[0].quantity).toBe(1);
  });

  test('Get cart with added product', async () => {
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    const res = await request(app)
      .get(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBe(1);
    expect(res.body.products[0].productId._id).toBe(product._id.toString());
  });

  test('Update quantity of cart item', async () => {
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    const res = await request(app)
      .put(`${BASE_URL}/cart/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.products[0].quantity).toBe(5);
  });

  test('Decrease quantity (or remove item if quantity = 1)', async () => {
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    const res = await request(app)
      .delete(`${BASE_URL}/cart/${product._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBe(0);
  });

  test('Clear entire cart', async () => {
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId: product._id });

    const res = await request(app)
      .delete(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cart cleared successfully');
  });

});
