const Product = require('../models/product.model');
const { redisClient } = require('../config/redis_cache');

const getAllProducts = async (page = 1, limit = 10) => {
  const cacheKey = `products:page=${page}&limit=${limit}`;
  const cachedProducts = await redisClient.get(cacheKey);
    
  if (cachedProducts) {
    return JSON.parse(cachedProducts);
  }
    
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };
    
  const products = await Product.paginate({}, options);
  await redisClient.set(cacheKey, JSON.stringify(products), 'EX', 3600);
  return products;
};

const getProductById = async (id) => {
  // Check Redis cache
  const cacheKey = `product:${id}`;
  const cachedProduct = await redisClient.get(cacheKey);
    
  if (cachedProduct) {
    return JSON.parse(cachedProduct);
  }
    
  // Fetch from DB if not cached
  const product = await Product.findById(id);
    
  if (product) {
    await redisClient.set(cacheKey, JSON.stringify(product), 'EX', 3600);
  }
    
  return product;
};

module.exports = { 
  getProductById,  
  getAllProducts,
};
