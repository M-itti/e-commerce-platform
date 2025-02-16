const express = require('express');
const auth = require('../../controllers/auth.controller');

const router = express.Router()

router.post('/sign-up', auth.signup)
router.post('/log-in', auth.login)
router.post('/registerSeller', auth.register);
router.post('/loginSeller', auth.SLogin);

module.exports = router
