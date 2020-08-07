const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // __dirname: get absolute path of the file where is used
        // path.join: concatenates files so it works on any OS  (do not use / (slashes))
        // "../" is allowed, to go up one level

        // render using the template engine defined in "view engine" in the folder defined in "views"
        // the second parameter is data that should be added to the template
        res.render('shop/product-list', {
            path: '/products',
            pageTitle: 'Shop',
            prods: products,
        });
    });
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId, (product) => {
        res.render('shop/product-detail', {
            path: '/products',
            pageTitle: product.title,
            product: product,
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/index', {
            path: '/',
            pageTitle: 'Shop',
            prods: products,
        });
    });
};

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Cart',
    });
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    console.log(productId);
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Cart',
    });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    });
};

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders',
    });
};
