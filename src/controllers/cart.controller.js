const cartService = require('../services/cart.service.js');
const { StatusCodes } = require('http-status-codes');

const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getUserCart(req.user.id);
    if (!cart) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Cart not found' });
    }
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const cart = await cartService.addProductToCart(req.user.id, productId);
    res.json(cart);
  } catch (err) {
    next(err)
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await cartService.updateCartItemQuantity(req.user.id, productId, quantity);
    res.json(cart);
  } catch (err) {
    next(err);
  }
};

const decreaseCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await cartService.decreaseCartItemQuantity(req.user.id, productId);
    res.json(cart);
  } catch (err) {
    next(err)
  }
};

const clearCart = async (req, res, next) => {
  try {
    await cartService.clearUserCart(req.user.id);
    res.json({ message: 'Cart cleared successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  decreaseCartItem,
  clearCart
};
