const { Router } = require('express');
const authRoute = require('.//auth.route');
const productRoute = require('./product.route');
const sellerRoute = require('./seller.route');

const router = Router();

router.use('/', authRoute);
router.use('/', productRoute);
router.use('/', sellerRoute);

module.exports = router;
