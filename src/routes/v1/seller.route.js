const express = require('express');
const roleVerifier = require('../../middlewares/role.verifier')
const passport = require("../../middlewares/authentication");

const { 
    createProduct,
    getSellerProducts,
    deleteProductById,
    updateProductById,
} = require('../../controllers/seller.controller');

const router = express.Router()

router.get('/seller', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), getSellerProducts);
router.post('/seller', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), createProduct);
router.put('/seller/:id', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), updateProductById);
router.delete('/seller/:id', passport.authenticate('jwt', { session: false }), roleVerifier("seller"), deleteProductById);

module.exports = router
