const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 2;

// __dirname: get absolute path of the file where is used
// path.join: concatenates files so it works on any OS  (do not use / (slashes))
// "../" is allowed, to go up one level

exports.getProducts = (req, res, next) => {
    let { page } = req.query;
    if (!page) page = 1;
    else page = parseInt(page);

    let total = null;
    Product.find()
        .countDocuments()
        .then((numProducts) => {
            total = numProducts;

            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then((result) => {
            const data = {
                path: '/products',
                pageTitle: 'Shop',
                prods: result,
                currentPage: page,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(total / ITEMS_PER_PAGE),
                hasNextPage: ITEMS_PER_PAGE * page < total,
                hasPreviousPage: page > 1,
            };

            // render using the template engine defined in "view engine" in the folder defined in "views"
            // the second parameter is data that should be added to the template
            res.render('shop/product-list', data);
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
    let { page } = req.query;
    if (!page) page = 1;
    else page = parseInt(page);

    let total = null;

    Product.find()
        .countDocuments()
        .then((numProducts) => {
            total = numProducts;

            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then((result) => {
            const data = {
                path: '/',
                pageTitle: 'Shop',
                prods: result,
                currentPage: page,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(total / ITEMS_PER_PAGE),
                hasNextPage: ITEMS_PER_PAGE * page < total,
                hasPreviousPage: page > 1,
            };

            res.render('shop/index', data);
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
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const products = user.cart.items;
            const data = {
                path: '/checkout',
                pageTitle: 'Checkout',
                products: products,
                total: products.reduce(
                    (previousValue, currentValue) =>
                        previousValue +
                        currentValue.productId.price * currentValue.quantity,
                    0
                ),
            };
            res.render('shop/checkout', data);
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
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

            const pdfDoc = new PDFDocument();

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true,
            });
            pdfDoc.fontSize(14);
            pdfDoc.text('----------------------');
            let totalPrice = 0;
            order.items.forEach((item) => {
                pdfDoc.text(
                    `${item.productId.title} - ${item.quantity} x $${item.productId.price}`
                );
                totalPrice += item.productId.price;
            });

            pdfDoc.text('----------------------');

            pdfDoc.fontSize(20).text('Total: $ ' + totalPrice);

            pdfDoc.end();

            pdfDoc.pipe(fs.createWriteStream(invoicePath));

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline`);
            pdfDoc.pipe(res);
        })
        .catch((err) => {
            return next(err);
        });
};
