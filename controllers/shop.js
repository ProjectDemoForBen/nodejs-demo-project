const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([products, fieldData]) => {
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
        })
        .catch((error) => {
            console.log('error ', error);
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
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/index', {
                path: '/',
                pageTitle: 'Shop',
                prods: rows,
            });
        })
        .catch((error) => {
            console.log('error ', error);
        });
};

exports.getCart = (req, res, next) => {
    console.log('getCart: init');

    Product.fetchAll()
        .then(([products, fieldData]) => {
            console.log('getCart: ', products);
            Cart.fetch((cart) => {
                console.log('getCart: cart: ', cart);
                const productsInCart = cart.products.map((cartProduct) => {
                    const prod = products.find(
                        (product) => product.id === cartProduct.id
                    );
                    return { ...prod, qty: cartProduct.qty };
                });
                console.log('getCart: productsInCart: ', productsInCart);

                res.render('shop/cart', {
                    path: '/cart',
                    pageTitle: 'Cart',
                    cart: {
                        products: productsInCart,
                    },
                });
            });
        })
        .catch((error) => {
            console.log('error ', error);
        });
};

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price, () => {
            console.log('postCart: redirecting');
            res.redirect('cart');
        });
    });
};

exports.postRemoveItemFromCart = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, (product) => {
        Cart.removeProduct(productId, product.price, () => {
            console.log('postRemoveItemFromCart: redirecting');
            res.redirect('cart');
        });
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
