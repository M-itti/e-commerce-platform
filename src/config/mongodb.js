const mongoose = require('mongoose');
const logger = require("./logger");
require('dotenv').config();  

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('MongoDB Connected');
  } catch (err) {
    logger.error('MongoDB connection error:', err);
    process.exit(1); 
  }
};

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error:', err);
  process.exit(1);
});

module.exports = connectMongoDB;
