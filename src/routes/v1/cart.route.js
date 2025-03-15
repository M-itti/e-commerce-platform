const express = require('express');
const passport = require('passport');
const { 
  getCart,
  addToCart,
  updateCartItem,
  decreaseCartItem,
  clearCart
} = require('../../controllers/cart.controller'); // ✅ Check this path

const roleVerifier = require('../../middlewares/roleVerifier');

const router = express.Router();

router.get('/cart', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), getCart);
router.post('/cart', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), addToCart);
router.put('/cart/:productId', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), updateCartItem); 
router.delete('/cart/:productId', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), decreaseCartItem); 
router.delete('/cart', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), clearCart); 

module.exports = router;
