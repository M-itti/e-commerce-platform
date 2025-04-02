const express = require('express');
const passport = require('passport');
const { 
  getCart,
  addToCart,
  updateCartItem,
  decreaseCartItem,
  clearCart
} = require('../../controllers/cart.controller'); 

const roleVerifier = require('../../middlewares/roleVerifier');

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get all items in the authenticated customer's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products in the customer's cart.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       400:
 *         description: Bad Request - Invalid request format or missing parameters.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.get('/cart', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the authenticated customer's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Product successfully added to the cart.
 *       400:
 *         description: Bad Request - Invalid product details.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.post('/cart', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), addToCart);

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update the quantity of a product in the authenticated customer's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to update.
 *     responses:
 *       200:
 *         description: Product quantity successfully updated.
 *       400:
 *         description: Bad Request - Invalid product details or product not found in cart.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.put('/cart/:productId', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), updateCartItem); 

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove a product from the authenticated customer's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to remove.
 *     responses:
 *       200:
 *         description: Product successfully removed from the cart.
 *       400:
 *         description: Bad Request - Product not found in the cart.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.delete('/cart/:productId', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), decreaseCartItem); 

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear all items from the authenticated customer's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All items successfully removed from the cart.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.delete('/cart', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), clearCart); 

module.exports = router;
