const express = require('express');
const shopController = require('../controllers/shop');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

// router.get('/', shopController.getIndex);
// router.get('/products', shopController.getProducts);
//
// // router expect path parameter (can be anything), so it will match if it is "/products/delete" (so the order will matter)
// // put more specific path first
// router.get('/products/:productId', shopController.getProduct);
//
// router.get('/cart', shopController.getCart);
// router.post('/cart', shopController.postCart);
// router.post('/cart-remove-item', shopController.postRemoveItemFromCart);
// //
// // router.get('/checkout', shopController.getCheckout);
// router.get('/orders', shopController.getOrders);
// router.post('/create-order', shopController.postCreateOrder);

module.exports = router;
