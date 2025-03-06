const Product = require('../models/product.model');
const { redisClient } = require('../config/redis_cache');

const createProduct = async (productData) => {
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    // Invalidate seller products cache
    const sellerId = productData.seller.toString();
    await redisClient.del(`seller:products:${sellerId}`);
    
    return savedProduct;
};

const getSellerProducts = async (sellerId) => {
    const cacheKey = `seller:products:${sellerId}`;
    
    // Check if data exists in cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
        console.log("Cache hit for seller products");
        return JSON.parse(cachedData);
    }
    
    // Fetch from database if not in cache
    console.log("Cache miss for seller products");
    const products = await Product.find({ seller: sellerId });
    
    // Store in Redis with expiry of 10 minutes
    await redisClient.set(cacheKey, JSON.stringify(products), 'EX', 600);
    
    return products;
};

const deleteProductById = async (id) => {
    const product = await Product.findById(id);
    
    if (!product) {
        return null;
    }
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    // Cache invalidation
    await redisClient.del(`product:${id}`);
    
    // Invalidate seller products cache
    const sellerId = product.seller.toString();
    await redisClient.del(`seller:products:${sellerId}`);
    
    return deletedProduct;
};

const updateProductById = async (id, updateData) => {
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    
    if (updatedProduct) {
        // Update product cache
        await redisClient.set(`product:${id}`, JSON.stringify(updatedProduct), 'EX', 600);
        
        // Invalidate seller products cache
        const sellerId = updatedProduct.seller.toString();
        await redisClient.del(`seller:products:${sellerId}`);
    }
    
    return updatedProduct;
};

module.exports = { 
    createProduct,
    getSellerProducts,
    deleteProductById,
    updateProductById
};
