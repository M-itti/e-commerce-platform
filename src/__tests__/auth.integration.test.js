const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongoServer;

const BASE_URL = '/api/v1/';  

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Test user signup (POST /sign-up)
describe('POST /sign-up and POST /log-in', () => {
  let token; // Store token for login test

  it('should successfully sign up a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword123',
    };

    const response = await request(app)
      .post(`${BASE_URL}/sign-up`)
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.username).toBe(userData.username);
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data.token).toBeDefined();

    // Save the token for login test
    token = response.body.data.token;
  });

  it('should log in with the correct credentials and return a token', async () => {
    const loginData = {
      username: 'testuser',
      password: 'testpassword123',
    };

    const response = await request(app)
      .post(`${BASE_URL}/log-in`) // Updated endpoint name here
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.username).toBe(loginData.username);
    expect(response.body.data.email).toBe('testuser@example.com');
  });

  it('should return 401 for invalid login credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'wrongpassword', // Invalid password
    };

    const response = await request(app)
      .post(`${BASE_URL}/log-in`) // Updated endpoint name here
      .send(loginData);

    expect(response.status).toBe(401); // Unauthorized status
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid credentials');
  });
});
