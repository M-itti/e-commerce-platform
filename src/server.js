require('dotenv').config();  
const express = require('express');
const connectMongoDB = require('./config/mongodb'); 
const { connectRedis } = require('./config/redis');  

const app = express();
const PORT = process.env.SERVER_PORT

connectMongoDB();
connectRedis();


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
