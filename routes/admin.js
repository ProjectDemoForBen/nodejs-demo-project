const path = require('path');
const express = require('express');

const rootDir = require('../utils/path');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

const products = [];

// default path is '/'
// use: it is a startsWith so, the specific address should be put first
// get,... : the url should match the path
router.get('/add-product', (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', {
        path: '/admin/add-product',
        formsCss: true,
        productCss: true,
        activeAddProduct: true,
        pageTitle: 'Add Product',
    });
});

router.post('/add-product', (req, res, next) => {
    // req.body is added by ExpressJS

    const title = req.body.title;
    products.push({ title });
    res.redirect('/');
});

module.exports = {
    router,
    products,
};
