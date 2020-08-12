const Product = require('../models/product');
// const Cart = require('../models/cart');

// __dirname: get absolute path of the file where is used
// path.join: concatenates files so it works on any OS  (do not use / (slashes))
// "../" is allowed, to go up one level

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then((result) => {
            // render using the template engine defined in "view engine" in the folder defined in "views"
            // the second parameter is data that should be added to the template
            res.render('shop/product-list', {
                path: '/products',
                pageTitle: 'Shop',
                prods: result,
            });
        })
        .catch((error) => {
            console.log('error ', error);
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
    Product.fetchAll()
        .then((result) => {
            res.render('shop/index', {
                path: '/',
                pageTitle: 'Shop',
                prods: result,
            });
        })
        .catch((error) => {
            console.log('error ', error);
        });
};

exports.getCart = (req, res, next) => {
    console.log('getCart: init');
    req.user
        .getCart()
        .then((cart) => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                cart: {
                    products: cart.items,
                },
            });
        })
        .catch((error) => {
            console.log(error);
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
        .catch((error) => {
            console.log(error);
        });
};

exports.postRemoveItemFromCart = (req, res, next) => {
    const { productId } = req.body;

    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts({
                where: {
                    id: productId,
                },
            });
        })
        .then((products) => {
            const product = products[0];
            return product.cart_item.destroy();
        })
        .then((result) => {
            console.log('postRemoveItemFromCart: redirecting');
            res.redirect('cart');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    });
};

exports.getOrders = (req, res, next) => {
    req.user
        // include: eager loading
        .getOrders({ include: ['products'] }) // because an Order has many Product(s), and Product has the many in the defined statement to 'product'
        .then((orders) => {
            console.log(orders);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders,
            });
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.postCreateOrder = (req, res, next) => {
    let fetchedCart = null;
    let createdOrder = null;
    let productsInCart = null;

    req.user
        .getCart()
        .then((cart) => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then((products) => {
            productsInCart = products;
            return req.user.createOrder();
        })
        .then((order) => {
            createdOrder = order;

            productsInCart.forEach((product) => {
                product.order_item = {
                    quantity: product.cart_item.quantity,
                };
            });

            return order.addProducts(productsInCart);
        })
        .then((result) => {
            console.log(result);

            return fetchedCart.setProducts(null);
            // return Promise.all(
            //     productsInCart.map((product) => product.cart_item.destroy())
            // );
        })
        .then((result) => {
            console.log(result);
            res.redirect('/orders');
        })
        .catch((error) => {
            console.log(error);
        });
};
