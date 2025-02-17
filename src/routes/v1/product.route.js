const express = require('express');
const roleVerifier = require('../../middlewares/role.verifier')
const passport = require("../../middlewares/authentication");

const { createProduct,
    getSellerProducts,
    deleteProductById,
    updateProductById
} = require('../../controllers/product.controller');

const router = express.Router()

router.post('/products', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), createProduct);
router.get('/products', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), getSellerProducts);
router.get('/products/:id', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), updateProductById);
route.put();

module.exports = router
