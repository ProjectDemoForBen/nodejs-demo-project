const express = require('express');
const path = require('path');

const rootDir = require('../utils/path');
const adminData = require('./admin');

// like a mini express which is plug to the expressjs
// works like app
const router = express.Router();

router.get('/', (req, res, next) => {
    // __dirname: get absolute path of the file where is used
    // path.join: concatenates files so it works on any OS  (do not use / (slashes))
    // "../" is allowed, to go up one level

    const products = adminData.products;
    console.log(products);

    // render using the template engine defined in "view engine" in the folder defined in "views"
    // the second parameter is data that should be added to the template
    res.render('shop', {
        path: '/',
        pageTitle: 'Shop',
        prods: products,
    });
});

module.exports = router;
