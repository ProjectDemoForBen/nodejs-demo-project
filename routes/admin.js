const express = require('express');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

const productsController = require('../controllers/products');

// default path is '/'
// use: it is a startsWith so, the specific address should be put first
// get,... : the url should match the path
router.get('/add-product', productsController.getAddProduct);
router.post('/add-product', productsController.postAddProduct);

module.exports = router;
