require("dotenv").config();
const { createClient } = require('redis');

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,  
    port: process.env.REDIS_PORT,  
  },
});

const connectRedis = async () => {
  redisClient.on('error', (err) => {
    console.error('Redis client error', err);
  });
  redisClient.on('ready', () => {
    console.log('Redis Connected');
  });

  await redisClient.connect();
  await redisClient.ping();
};

module.exports = { redisClient, connectRedis };
