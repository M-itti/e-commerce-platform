const ShoppingCart = require('../models/cart.model.js');
const Product = require('../models/product.model.js');

const getUserCart = async (userId) => {
  const cart = await ShoppingCart.findOne({ userId }).populate('products.productId');
  return cart;
};

const addProductToCart = async (userId, productId) => {
  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  let cart = await ShoppingCart.findOne({ userId });
  if (!cart) {
    cart = new ShoppingCart({ userId, products: [] });
  }

  // Check if product is already in the cart
  const existingProduct = cart.products.find(p => p.productId.toString() === productId);
  if (existingProduct) {
    // Increment the quantity by 1
    existingProduct.quantity += 1;
  } else {
    // Add product to the cart with a quantity of 1
    cart.products.push({ productId, quantity: 1 });
  }

  await cart.save();
  return cart;
};

const updateCartItemQuantity = async (userId, productId, quantity) => {
  const cart = await ShoppingCart.findOne({ userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
  if (productIndex === -1) {
    throw new Error('Product not in cart');
  }

  cart.products[productIndex].quantity = quantity;
  await cart.save();
  return cart;
};

const decreaseCartItemQuantity = async (userId, productId) => {
  const cart = await ShoppingCart.findOne({ userId });
  if (!cart) {
    throw new Error('Cart not found');
  }

  const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
  if (productIndex === -1) {
    throw new Error('Product not in cart');
  }

  cart.products[productIndex].quantity -= 1;
  if (cart.products[productIndex].quantity === 0) {
    cart.products.splice(productIndex, 1);
  }

  await cart.save();
  return cart;
};

const clearUserCart = async (userId) => {
  await ShoppingCart.findOneAndUpdate({ userId }, { products: [] });
  return { success: true };
};

module.exports = {
  getUserCart,
  addProductToCart,
  updateCartItemQuantity,
  decreaseCartItemQuantity,
  clearUserCart
};
