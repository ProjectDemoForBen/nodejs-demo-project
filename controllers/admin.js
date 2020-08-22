const { validationResult } = require('express-validator');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        errorMessage: '',
        oldInput: {},
        validationErrors: [],
    });
};

exports.postAddProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/edit-product', {
            path: '/admin/add-product',
            pageTitle: 'Add Product',
            errorMessage: errors.array()[0].msg,
            oldInput: { ...req.body },
            validationErrors: errors.array(),
        });
    }

    // req.body is added by ExpressJS
    const { title, imageUrl, description, price } = req.body;

    // the values are map to the attributes in the schema
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        userId: req.user, // saves only the '_id'
    });

    product
        .save()
        .then((r) => {
            res.redirect('/admin/products');
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId)
        .then((product) => {
            res.render('admin/edit-product', {
                path: '',
                pageTitle: 'Edit Product',
                errorMessage: '',
                oldInput: { ...product._doc },
                validationErrors: [],
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postEditProduct = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('admin/edit-product', {
            path: '',
            pageTitle: 'Edit Product',
            errorMessage: errors.array()[0].msg,
            oldInput: { ...req.body },
            validationErrors: errors.array(),
        });
    }

    // req.body is added by ExpressJS
    const { _id, title, imageUrl, description, price } = req.body;

    Product.find({
        _id: _id,
        userId: req.user._id,
    })
        .then((products) => {
            if (products.length > 0) {
                const product = products[0];
                product.title = title;
                product.price = price;
                product.imageUrl = imageUrl;
                product.description = description;

                return product.save();
            }
        })
        .then((updatedProduct) => {
            res.redirect('/admin/products');
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
        .then((result) => {
            res.render('admin/products', {
                path: '/admin/products',
                pageTitle: 'Products',
                prods: result,
            });
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};

exports.postDeleteProduct = (req, res, next) => {
    const { id } = req.body;

    Product.deleteOne({
        _id: id,
        userId: req.user._id,
    })
        .then((result) => {
            res.redirect('/admin/products');
        })
        .catch((err) => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
};
