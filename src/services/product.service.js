const Product = require('../models/product.model');

const getProductById = async (id) => {
    return await Product.findById(id); 
};

module.exports = { 
    getProductById,  
};
