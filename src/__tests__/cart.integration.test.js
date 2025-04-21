const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { RedisMemoryServer } = require('redis-memory-server');
const mongoose = require("mongoose");
const request = require('supertest');
const app = require('../app');
const { redisClient, connectRedis } = require('../config/redis_cache');
const jwt = require('jsonwebtoken');
const Product = require('../models/product.model');
const ShoppingCart = require('../models/cart.model.js');

let redisServer;
let mongoServer;
let token;
let sellerId;

const BASE_URL = '/api/v1';  

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
    
  // mongoose memory server setup
  mongoServer = await require('mongodb-memory-server').MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
    
  // generate jwt token for testing
  const res = await request(app)
    .post(`${BASE_URL}/sign-up`)
    .send({
      username: 'testuser',
      password: 'password',
      email: 'test@example.com',
    });
    
  // extract sellerId from token
  token = res.body.data.token; 
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  sellerId = decoded.id;
});

afterAll(async () => {
  await redisClient.quit();
  await redisServer.stop();

  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Shopping Cart API', () => {
  let productId;

  beforeEach(async () => {
    await Product.deleteMany();
    await ShoppingCart.deleteMany();

    const product = await Product.create({
      name: 'Laptop',
      price: 1299,
      stock: 5,
      description: 'High-end gaming laptop',
      seller: sellerId,
      category: 'Electronics',
    });

    productId = product._id.toString();
  });

  afterEach(async () => {
    await Product.deleteMany();
    await ShoppingCart.deleteMany();
  });

  it('should add a product to the cart', async () => {
    const res = await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBe(1);
    expect(res.body.products[0].productId).toBe(productId);
    expect(res.body.products[0].quantity).toBe(1);
  });

  it('should update quantity of an item in the cart', async () => {
    // First add product to cart
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });

    // Now update quantity
    const res = await request(app)
      .put(`${BASE_URL}/cart/:productId`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 3 });

    expect(res.statusCode).toBe(200);
    expect(res.body.products[0].quantity).toBe(3);
  });

  it('should decrease quantity of a cart item', async () => {
    // Add product twice
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });
    
    await request(app)
      .put(`${BASE_URL}/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId, quantity: 2 });
    
    // Now decrease it
    const res = await request(app)
      .delete(`${BASE_URL}/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.products[0].quantity).toBe(1);
  });

  it('should remove product from cart if quantity is decreased to 0', async () => {
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });

    // Decrease once (should remove item)
    const res = await request(app)
      .delete(`${BASE_URL}/cart/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBe(0);
  });

  it('should return the current user cart', async () => {
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });

    const res = await request(app)
      .get(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.products[0].productId._id).toBe(productId);
  });

  it('should clear the cart', async () => {
    await request(app)
      .post(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`)
      .send({ productId });

    const res = await request(app)
      .delete(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Cart cleared successfully');

    const getRes = await request(app)
      .get(`${BASE_URL}/cart`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.products.length).toBe(0);
  });
});
