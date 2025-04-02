require('dotenv').config();  
const connectMongoDB = require('./config/mongodb'); 
const { connectRedis } = require('./config/redis_cache');  

const app = require('./app');
const PORT = process.env.SERVER_PORT;

// **** start server ****
(async () => {
  try {
    await connectMongoDB();  
    await connectRedis();  


    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`); 
    });
  } catch (err) {
    console.error('Failed to start the server:', err);
    process.exit(1);
  }
})();
