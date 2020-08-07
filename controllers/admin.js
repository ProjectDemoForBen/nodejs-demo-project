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
    const product = new Product(null, title, imageUrl, description, price);
    product.save();

    res.redirect('/admin/products');
};

exports.getEditProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId, (product) => {
        res.render('admin/edit-product', {
            path: '',
            pageTitle: 'Edit Product',
            product: product,
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    // req.body is added by ExpressJS
    const { id, title, imageUrl, description, price } = req.body;
    const product = new Product(id, title, imageUrl, description, price);
    product.save();

    res.redirect('/admin/products');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/products', {
            path: '/admin/products',
            pageTitle: 'Products',
            prods: products,
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const { id } = req.body;
    Product.deleteById(id, () => {
        res.redirect('/admin/products');
    });
};
