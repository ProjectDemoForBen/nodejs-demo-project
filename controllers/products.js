const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
    });
};

exports.postAddProduct = (req, res, next) => {
    // req.body is added by ExpressJS

    const title = req.body.title;
    const product = new Product(title);
    product.save();

    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        // __dirname: get absolute path of the file where is used
        // path.join: concatenates files so it works on any OS  (do not use / (slashes))
        // "../" is allowed, to go up one level

        // render using the template engine defined in "view engine" in the folder defined in "views"
        // the second parameter is data that should be added to the template
        res.render('shop', {
            path: '/',
            pageTitle: 'Shop',
            prods: products,
        });
    });
};
