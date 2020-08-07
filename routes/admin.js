const express = require('express');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

const adminController = require('../controllers/admin');

// default path is '/'
// use: it is a startsWith so, the specific address should be put first
// get,... : the url should match the path
router.get('/add-product', adminController.getAddProduct);
router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getProducts);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
