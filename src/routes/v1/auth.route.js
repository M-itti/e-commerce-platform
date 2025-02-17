const express = require('express');
const auth = require('../../controllers/auth.controller');

const router = express.Router()

router.post('/sign-up', auth.userSignup)
router.post('/log-in', auth.userLogin)
router.post('/registerSeller', auth.sellerSignup);
router.post('/loginSeller', auth.sellerLogin);

module.exports = router
