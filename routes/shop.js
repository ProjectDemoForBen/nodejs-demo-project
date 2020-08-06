const express = require('express');
const productsController = require('../controllers/products');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

router.get('/', productsController.getProducts);

module.exports = router;
