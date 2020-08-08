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

    Product.create({
        title,
        imageUrl,
        description,
        price,
    })
        .then((r) => {
            console.log(r);
            res.redirect('/admin/products');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getEditProduct = (req, res, next) => {
    const { productId } = req.params;

    Product.findByPk(productId)
        .then(({ dataValues }) => {
            res.render('admin/edit-product', {
                path: '',
                pageTitle: 'Edit Product',
                product: dataValues,
            });
        })
        .catch((error) => console.log(error));
};

exports.postEditProduct = (req, res, next) => {
    // req.body is added by ExpressJS
    const { id, title, imageUrl, description, price } = req.body;

    Product.findByPk(id)
        .then((product) => {
            product.title = title;
            product.imageUrl = imageUrl;
            product.description = description;
            product.price = price;
            return product.save();
        })
        .then((updatedProduct) => {
            res.redirect('/admin/products');
        })
        .catch((error) => {
            console.log(error);
        });
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
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

    Product.findByPk(id)
        .then((product) => {
            return product.destroy();
        })
        .then((result) => {
            res.redirect('/admin/products');
        })
        .catch((error) => {
            console.log(error);
        });
    //
    // Product.destroy({
    //     where: {
    //         id: id,
    //     },
    // })
    //     .then((result) => {
    //         res.redirect('/admin/products');
    //     })
    //     .catch((error) => {});
};
