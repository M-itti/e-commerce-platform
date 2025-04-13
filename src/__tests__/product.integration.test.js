const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { RedisMemoryServer } = require('redis-memory-server');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app');
const { redisClient, connectRedis } = require('../config/redis_cache');
const jwt = require('jsonwebtoken');
const Product = require('../models/product.model');

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
    .post(`${BASE_URL}/registerSeller`)
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

describe('GET /products', () => {
  afterEach(async () => {
    await redisClient.flushAll(); // Clear Redis to avoid test interference
    await Product.deleteMany();
  });

  beforeEach(async () => {
    await Product.deleteMany();
    await Product.create([
      {
        name: 'Phone',
        price: 699,
        stock: 10,
        description: 'Smartphone',
        seller: sellerId,
        category: 'Electronics',
      },
      {
        name: 'T-shirt',
        price: 19,
        stock: 50,
        description: 'Cotton T-shirt',
        seller: sellerId,
        category: 'Clothing',
      }
    ]);
    await redisClient.flushAll(); // Clear Redis before each test
  });

  it('should return paginated products', async () => {
    const res = await request(app)
      .get(`${BASE_URL}/products?page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('docs');
    expect(res.body.docs.length).toBe(2);
    expect(res.body.docs[0]).toHaveProperty('name');
    expect(res.body.docs[0]).toHaveProperty('price');
  });

  it('should return cached products on subsequent requests', async () => {
    const cacheKey = 'products:page=1&limit=10';

    // First request - populates cache
    const res1 = await request(app)
      .get(`${BASE_URL}/products?page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`);

    expect(res1.statusCode).toBe(200);
    expect(res1.body.docs.length).toBe(2);

    // Cache should now exist
    const cached = await redisClient.get(cacheKey);
    expect(cached).not.toBeNull();

    // Second request - should still return same data (implicitly from cache)
    const res2 = await request(app)
      .get(`${BASE_URL}/products?page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.docs.length).toBe(2);
  });

  it('should return 200 with empty array if no products', async () => {
    await Product.deleteMany();
    await redisClient.flushAll();

    const res = await request(app)
      .get(`${BASE_URL}/products?page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.docs).toEqual([]);
  });
});
