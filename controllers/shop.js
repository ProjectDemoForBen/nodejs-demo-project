const fs = require('fs');
const path = require('path');

const Product = require('../models/product');
const Order = require('../models/order');

// __dirname: get absolute path of the file where is used
// path.join: concatenates files so it works on any OS  (do not use / (slashes))
// "../" is allowed, to go up one level

exports.getProducts = (req, res, next) => {
    Product.find()
        .then((result) => {
            // render using the template engine defined in "view engine" in the folder defined in "views"
            // the second parameter is data that should be added to the template
            res.render('shop/product-list', {
                path: '/products',
                pageTitle: 'Shop',
                prods: result,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;

    Product.findById(productId).then((r) => {
        res.render('shop/product-detail', {
            path: '/products',
            pageTitle: r.title,
            product: r,
        });
    });
};

exports.getIndex = (req, res, next) => {
    Product.find()
        .then((result) => {
            res.render('shop/index', {
                path: '/',
                pageTitle: 'Shop',
                prods: result,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCart = (req, res, next) => {
    console.log('getCart: init');
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                cart: {
                    products: user.cart.items,
                },
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;

    Product.findById(productId)
        .then((product) => {
            return req.user.addToCart(product);
        })
        .then((result) => {
            console.log(result);
            res.redirect('cart');
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postRemoveItemFromCart = (req, res, next) => {
    const { itemId } = req.body;

    req.user
        .deleteItemFromCart(itemId)
        .then((result) => {
            console.log('postRemoveItemFromCart: redirecting');
            res.redirect('cart');
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    });
};

exports.getOrders = (req, res, next) => {
    Order.find({
        userId: req.user._id,
    })
        .then((orders) => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postCreateOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then((result) => {
            console.log(result);
            res.redirect('/orders');
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getInvoice = (req, res, next) => {
    Order.findById(req.params.orderId)
        .then((order) => {
            if (!order || order.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Cannot get invoice for order'));
            }

            const invoiceName = `${req.params.orderId}.pdf`;
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const file = fs.createReadStream(invoicePath);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline`);
            file.pipe(res);
        })
        .catch((err) => {
            return next(err);
        });
};
