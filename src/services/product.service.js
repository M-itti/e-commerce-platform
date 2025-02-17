const Product = require('../models/product.model');

const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

const getSellerProducts = async (sellerId) => {
    return await Product.find({ seller: sellerId });
};

const deleteProductById = async (id) => {
    return await Product.findByIdAndDelete(id);
};

const updateProductById = async (id, updateData) => {
    return await Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
};

module.exports = { 
    createProduct,
    getSellerProducts,
    deleteProductById,
    updateProductById
};
