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

// delete product by id
const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params; 

        const deletedProduct = await productService.deleteProductById(id);

        if (!deletedProduct) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Product not found' });
        }

        res.status(httpStatus.OK).json({ message: 'Product deleted successfully' });
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

const updateProductById = async (req, res) => {
    try {
        const { id } = req.params; 
        const updateData = req.body; 

        const updatedProduct = await productService.updateProductById(id, updateData);

        if (!updatedProduct) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Product not found' });
        }

        res.status(httpStatus.OK).json(updatedProduct);
    } catch (err) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: err.message });
    }
};

module.exports = { 
    getAllProducts,
    createProduct,
    getSellerProducts,
    updatedProductById
};
