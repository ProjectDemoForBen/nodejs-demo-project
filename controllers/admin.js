const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    // res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('admin/edit-product', {
        path: '/admin/add-product',
        pageTitle: 'Add Product',
        product: null,
    });
};

exports.postAddProduct = (req, res, next) => {
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
        .catch((error) => {
            console.log(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId)
        .then((product) => {
            res.render('admin/edit-product', {
                path: '',
                pageTitle: 'Edit Product',
                product: product,
            });
        })
        .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    // req.body is added by ExpressJS
    const { id, title, imageUrl, description, price } = req.body;

    Product.find({
        _id: id,
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
        .catch((error) => {
            console.log(error);
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
        .catch((error) => {
            console.log('error ', error);
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
        .catch((error) => {
            console.log(error);
        });
};
