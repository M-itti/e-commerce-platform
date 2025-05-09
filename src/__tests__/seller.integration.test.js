const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require("mongoose");
const { RedisMemoryServer } = require('redis-memory-server');
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
    .post(`${BASE_URL}/auth/sellers/sign-up`)
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

describe('POST /api/v1/seller', () => {
  afterEach(async () => {
    await redisClient.del(`seller:products:${sellerId}`);
    await Product.deleteMany();
  });

  it('should create a product and return it', async () => {
    const newProduct = {
      name: 'Test Product',
      price: 99.99,
      stock: 10,
      description: 'A product for testing',
      category: 'Clothing',
      seller: sellerId,
    };

    const res = await request(app)
      .post(`${BASE_URL}/seller`)
      .set('Authorization', `Bearer ${token}`)
      .send(newProduct);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.price).toBe(newProduct.price);
    expect(res.body.stock).toBe(newProduct.stock);
    expect(res.body.description).toBe(newProduct.description);
    expect(res.body.category).toBe(newProduct.category);
  });
});

describe('GET /seller/products', () => {
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
    await redisClient.del(`seller:products:${sellerId}`);
  });

  afterEach(async () => {
    await redisClient.del(`seller:products:${sellerId}`);
    await Product.deleteMany();
  });

  it('should fetch seller products from DB and cache them', async () => {
    const res = await request(app)
      .get(`${BASE_URL}/seller`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty('name');

    // Check Redis cache now contains the products
    const cached = await redisClient.get(`seller:products:${sellerId}`);
    expect(cached).not.toBeNull();
    const parsed = JSON.parse(cached);
    expect(parsed.length).toBe(2);
  });

  it('should return cached products on subsequent request', async () => {
    // First request to populate cache
    await request(app)
      .get(`${BASE_URL}/seller`)
      .set('Authorization', `Bearer ${token}`);

    // Delete products from DB
    await Product.deleteMany();

    // Second request should return cached data
    const res = await request(app)
      .get(`${BASE_URL}/seller`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2); // still gets 2 from cache
  });
});

describe('Product Controller', () => {
  let productId;

  beforeEach(async () => {
    const product = new Product({
      name: 'Initial Product',
      price: 50,
      stock: 20,
      description: 'Just testing',
      category: 'Clothing',
      seller: sellerId,
    });

    const savedProduct = await product.save();
    productId = savedProduct._id.toString();
  });

  afterEach(async () => {
    await Product.deleteMany({});
    await redisClient.flushAll(); 
  });

  // UPDATE TEST
  it('should update a product and return updated data', async () => {
    const updatedFields = {
      name: 'Updated Product',
      price: 75,
    };

    const res = await request(app)
      .put(`${BASE_URL}/seller/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedFields)
      .expect(200);

    expect(res.body.name).toBe(updatedFields.name);
    expect(res.body.price).toBe(updatedFields.price);

    const updatedFromDb = await Product.findById(productId);
    expect(updatedFromDb.name).toBe(updatedFields.name);
  });

  it('should return 404 when updating a non-existent product', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`${BASE_URL}/seller/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Nope' })
      .expect(404);

    expect(res.body.error).toBe('Product not found');
  });

  // DELETE TEST
  it('should delete a product successfully', async () => {
    const res = await request(app)
      .delete(`${BASE_URL}/seller/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.message).toBe('Product deleted successfully');

    const fromDb = await Product.findById(productId);
    expect(fromDb).toBeNull();
  });

  it('should return 404 when deleting a non-existent product', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`${BASE_URL}/seller/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404);

    expect(res.body.error).toBe('Product not found');
  });
});
