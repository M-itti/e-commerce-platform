const express = require('express');
const auth = require('../../controllers/auth.controller');

const router = express.Router()

/**
 * @swagger
 * /auth/customers/sign-up:
 *   post:
 *     summary: Register a new customer
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       409:
 *         description: Username already exists.
 *       500:
 *         description: Internal server error.
 */
router.post('/auth/customers/sign-up', auth.userSignup)

/**
 * @swagger
 * /auth/customers/log-in:
 *   post:
 *     summary: Authenticate a customer
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post('/auth/customers/log-in', auth.userLogin)

/**
 * @swagger
 * /auth/sellers/sign-up:
 *   post:
 *     summary: Register a new seller
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Seller registered successfully.
 *       409:
 *         description: Email already in use.
 *       500:
 *         description: Internal server error.
 */
router.post('/auth/sellers/sign-up', auth.sellerSignup);

/**
 * @swagger
 * /auth/sellers/log-in:
 *   post:
 *     summary: Authenticate a seller
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seller logged in successfully.
 *       401:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post('/auth/sellers/log-in', auth.sellerLogin);

module.exports = router
