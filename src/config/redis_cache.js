require("dotenv").config();
const { createClient } = require('redis');
const logger = require("./logger");

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,  
    port: process.env.REDIS_PORT,  
  },
});

const connectRedis = async () => {
  redisClient.on('error', (err) => {
    logger.error('Redis client error', err);
  });
  redisClient.on('ready', () => {
    logger.info('Redis Connected');
  });

  await redisClient.connect();
  await redisClient.ping();
};

module.exports = { redisClient, connectRedis };
