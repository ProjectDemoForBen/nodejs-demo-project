const { validationResult } = require('express-validator');

const Product = require('../models/product');
const fileHelper = require('../utils/file');

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
        return res.status(422).render('admin/edit-product', {
            path: '/admin/add-product',
            pageTitle: 'Add Product',
            errorMessage: errors.array()[0].msg,
            oldInput: { ...req.body },
            validationErrors: errors.array(),
        });
    }
    // req.file is added by multer
    if (!req.file) {
        return res.status(422).render('admin/edit-product', {
            path: '/admin/add-product',
            pageTitle: 'Add Product',
            errorMessage: 'Image should be png, jpg, jpeg',
            oldInput: { ...req.body },
            validationErrors: [],
        });
    }

    // req.body is added by ExpressJS
    const { title, description, price } = req.body;
    const imageUrl = req.file.path;
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
    const { _id, title, description, price } = req.body;
    const image = req.file;
    Product.find({
        _id: _id,
        userId: req.user._id,
    })
        .then((products) => {
            if (products.length > 0) {
                const product = products[0];
                product.title = title;
                product.price = price;
                if (image) {
                    fileHelper.deleteFile(product.imageUrl);
                    product.imageUrl = image.path;
                }
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

    Product.findById(id)
        .then((product) => {
            if (!product) {
                next(new Error('Product not found'));
            }
            fileHelper.deleteFile(product.imageUrl);

            return Product.deleteOne({
                _id: id,
                userId: req.user._id,
            });
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

exports.deleteProduct = (req, res, next) => {
    const { productId } = req.params;

    Product.findById(productId)
        .then((product) => {
            throw new Error('xxx');
            if (!product) {
                return res.status(500).json({ message: 'Product not found' });
            }

            fileHelper.deleteFile(product.imageUrl);

            return Product.deleteOne({
                _id: productId,
                userId: req.user._id,
            });
        })
        .then((result) => {
            res.status(200).json({ message: 'Product deleted' });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Error deleting product' });
        });
};
