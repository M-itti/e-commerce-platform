const express = require('express');
const auth = require('../../controllers/auth.controller');

const router = express.Router()

/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: Register a new user
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
router.post('/sign-up', auth.userSignup)

/**
 * @swagger
 * /log-in:
 *   post:
 *     summary: Authenticate a user
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
router.post('/log-in', auth.userLogin)

/**
 * @swagger
 * /registerSeller:
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
 *               name:
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
router.post('/registerSeller', auth.sellerSignup);

/**
 * @swagger
 * /loginSeller:
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
router.post('/loginSeller', auth.sellerLogin);

module.exports = router
