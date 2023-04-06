const express = require('express');

const auth = require('./auth');
const products = require('./product');
const payment = require('./payment');

const router = express();

router.use('/auth', auth);
router.use('/products', products);
router.use('/payment', payment);

module.exports = router;