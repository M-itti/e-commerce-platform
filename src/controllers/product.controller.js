const HttpException = require('../utils/HttpException');
const productService = require("../services/product.service");
const httpStatus = require('http-status');

// Create a Product
const createProduct = async (req, res) => {
    try {
        const { name, price, stock, description, category } = req.body;
        const productData = {
            name,
            price,
            stock,
            description,
            category,
            seller: req.user._id,
        };

        const product = await productService.createProduct(productData);
        res.status(httpStatus.CREATE).json(product);
    } catch (err) {
        res.status(httpStatus.UNAUTHORIZED).json({ error: err.message });
    }
};

// Get Seller's Products
const getSellerProducts = async (req, res) => {
    try {
        const products = await productService.getSellerProducts(req.user._id);
        res.json(products);
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        res.status(httpStatus.CREATE).json({
          success: true,
        });
    } catch(err) {
        console.error(err);
        next(err);
    }
}

module.exports = { 
    getAllProducts,
    createProduct,
    getSellerProducts 
};
