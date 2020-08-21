const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

const adminController = require('../controllers/admin');

// all the next routes will require to be authenticated
router.use(isAuth);

// default path is '/'
// use: it is a startsWith so, the specific address should be put first
// get,... : the url should match the path
router.get('/add-product', adminController.getAddProduct);
router.post(
    '/add-product',
    [
        body('title', 'title should have at least 5 alphanumeric characters')
            .isAlphanumeric()
            .isLength({ min: 5 })
            .trim(),
        body('imageUrl', 'imageUrl does not have an url format').isURL(),
        body('price', 'price should be bigger than 0')
            .isNumeric()
            .isInt({ gt: 0 }),
        body('description').trim(),
    ],
    adminController.postAddProduct
);
//
router.get('/products', adminController.getProducts);
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post(
    '/edit-product',
    [
        body('title', 'title should have at least 5 alphanumeric characters')
            .isAlphanumeric()
            .isLength({ min: 5 })
            .trim(),
        body('imageUrl', 'imageUrl does not have an url format').isURL(),
        body('price', 'price should be bigger than 0')
            .isNumeric()
            .isInt({ gt: 0 }),
        body('description').trim(),
    ],
    adminController.postEditProduct
);

router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;
