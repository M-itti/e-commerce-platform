const express = require('express');
const roleVerifier = require('../../middlewares/role.verifier')
const passport = require("../../middlewares/authentication");

const { createProduct, getSellerProducts } = require('../../controllers/product.controller');

const router = express.Router()

router.post('/products', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), createProduct);
router.get('/products', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), getSellerProducts);

module.exports = router
