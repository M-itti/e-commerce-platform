const productService = require("../services/product.service");
const { StatusCodes } = require('http-status-codes');

const getAllProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const products = await productService.getAllProducts(parseInt(page), parseInt(limit));

    res.status(StatusCodes.OK).json(products);

  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductById(id);
        
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Product not found' });
    }
        
    res.status(StatusCodes.OK).json(product);

  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getAllProducts,
  getProductById,
};
