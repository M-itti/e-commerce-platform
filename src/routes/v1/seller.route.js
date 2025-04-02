const express = require('express');
const roleVerifier = require('../../middlewares/roleVerifier')
const passport = require("../../middlewares/authentication");

const { 
  createProduct,
  getSellerProducts,
  deleteProductById,
  updateProductById,
} = require('../../controllers/seller.controller');

const router = express.Router()

/**
 * @swagger
 * /seller:
 *   get:
 *     summary: Get all products of the authenticated seller
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of seller's products.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       400:
 *         description: Bad Request - User role not found.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.get('/seller', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), getSellerProducts);

/**
 * @swagger
 * /seller:
 *   post:
 *     summary: Create a new product (Seller only)
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       400:
 *         description: Bad Request - User role not found.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.post('/seller', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), createProduct);

/**
 * @swagger
 * /seller/{id}:
 *   put:
 *     summary: Update a product by ID (Seller only)
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       404:
 *         description: Product not found.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       400:
 *         description: Bad Request - User role not found.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.put('/seller/:id', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), updateProductById);

/**
 * @swagger
 * /seller/{id}:
 *   delete:
 *     summary: Delete a product by ID (Seller only)
 *     tags:
 *       - Seller
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 *       401:
 *         description: Unauthorized - User not authenticated.
 *       400:
 *         description: Bad Request - User role not found.
 *       403:
 *         description: Forbidden - Insufficient permissions.
 *       500:
 *         description: Internal server error.
 */
router.delete('/seller/:id', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), deleteProductById);

module.exports = router
