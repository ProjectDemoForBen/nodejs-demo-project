const express = require('express');
const shopController = require('../controllers/shop');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);
router.get('/orders', shopController.getOrders);

module.exports = router;
