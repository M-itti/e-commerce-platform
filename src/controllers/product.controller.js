const HttpException = require('../utils/HttpException');
const productService = require("../services/product.service");
const { redisClient } = require('../config/redis_cache');
const { status } = require('http-status');

const getAllProducts = async (req, res, next) => {
    try {
        res.status(status.CREATED).json({
          success: true,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check Redis cache
        const cachedProduct = await redisClient.get(`product:${id}`);
        if (cachedProduct) {
            console.log("Cache hit");
            return res.status(status.OK).json(JSON.parse(cachedProduct));
        }

        console.log("Cache miss");
        // Fetch from DB if not cached
        const product = await productService.getProductById(id);
        if (!product) {
            return res.status(status.NOT_FOUND).json({ error: 'Product not found' });
        }

        await redisClient.set(`product:${id}`, JSON.stringify(product), 'EX', 3600); 

        res.status(status.OK).json(product);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

module.exports = { 
    getAllProducts,
    getProductById,
};
