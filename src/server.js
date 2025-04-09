require('dotenv').config();  
const connectMongoDB = require('./config/mongodb'); 
const { connectRedis } = require('./config/redis_cache');  
const logger = require("./config/logger");

const app = require('./app');
const PORT = process.env.SERVER_PORT;

// **** start server ****
(async () => {
  try {
    await connectMongoDB();  
    await connectRedis();  


    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`); 
    });
  } catch (err) {
    logger.error('Failed to start the server:', err);
    process.exit(1);
  }
})();
