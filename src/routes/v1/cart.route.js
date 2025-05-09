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
 *       - CustomerAuth: []
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
 * /cart/{productId}:
 *   put:
 *     summary: Update the quantity of a product in the authenticated customer's cart
 *     tags:
 *       - Cart
 *     security:
 *       - CustomerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 2
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
router.post('/cart', passport.authenticate('jwt', { session: false }), roleVerifier("customer"), addToCart);

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: add Update the quantity of a product in the authenticated customer's cart
 *     tags:
 *       - Cart
 *     security:
 *       - CustomerAuth: []
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
 *       - CustomerAuth: []
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
 *       - CustomerAuth: []
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
