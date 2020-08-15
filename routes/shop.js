const express = require('express');
const shopController = require('../controllers/shop');

const isAuth = require('../middleware/is-auth');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);

// router expect path parameter (can be anything), so it will match if it is "/products/delete" (so the order will matter)
// put more specific path first
router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-remove-item', isAuth, shopController.postRemoveItemFromCart);

// router.get('/checkout', shopController.getCheckout);
router.get('/orders', isAuth, shopController.getOrders);
router.post('/create-order', isAuth, shopController.postCreateOrder);

module.exports = router;
