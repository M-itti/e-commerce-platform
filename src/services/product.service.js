const Product = require('../models/product.model');

const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

const getSellerProducts = async (sellerId) => {
    return await Product.find({ seller: sellerId });
};

module.exports = { createProduct, getSellerProducts };
