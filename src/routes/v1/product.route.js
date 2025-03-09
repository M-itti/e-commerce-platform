const express = require('express');

const { 
    getAllProducts,
    getProductById,
} = require('../../controllers/product.controller');

const router = express.Router()

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of products
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of products.
 *       500:
 *         description: Internal server error.
 */
router.get('/products', getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details.
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/products/:id', getProductById);

module.exports = router
