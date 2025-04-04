const sellerService = require("../services/seller.service");
const { status } = require('http-status');

// Create a Product
const createProduct = async (req, res, next) => {
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
    const product = await sellerService.createProduct(productData);
    res.status(status.CREATED).json(product);
  } catch (err) {
    next(err);
  }
};

// Get all Seller's Products
const getSellerProducts = async (req, res, next) => {
  try {
    const sellerId = req.user._id;
    const products = await sellerService.getSellerProducts(sellerId);
    res.json(products);
  } catch (err) {
    next(err)
  }
};

// delete product by id
const deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const deletedProduct = await sellerService.deleteProductById(id);
        
    if (!deletedProduct) {
      return res.status(status.NOT_FOUND).json({ error: 'Product not found' });
    }
        
    res.status(status.OK).json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Update product by id
const updateProductById = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const updateData = req.body; 
    const updatedProduct = await sellerService.updateProductById(id, updateData);
        
    if (!updatedProduct) {
      return res.status(status.NOT_FOUND).json({ error: 'Product not found' });
    }
        
    res.status(status.OK).json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

module.exports = { 
  getSellerProducts,
  createProduct,
  updateProductById,
  deleteProductById
};
