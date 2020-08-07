const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

const cartFile = path.join(rootDir, 'data', 'cart.json');

const getCartFromFile = (cb) => {
    fs.readFile(cartFile, (err, data) => {
        if (err) {
            cb({ products: [], totalPrice: 0 });
            return;
        }
        cb(JSON.parse(data));
    });
};

module.exports = class Cart {
    static fetch = (cb) => {
        getCartFromFile(cb);
    };

    static addProduct = (id, productPrice) => {
        id = parseInt(id);
        productPrice = parseInt(productPrice);
        getCartFromFile((cart) => {
            cart.products = [...cart.products];

            const index = cart.products.findIndex(
                (product) => product.id === id
            );

            if (index >= 0) {
                const product = cart.products.find(
                    (product) => product.id === id
                );
                cart.products[index] = { ...product, qty: product.qty + 1 };
            } else {
                cart.products.push({ id: id, qty: 1 });
            }
            cart.totalPrice += productPrice;
            fs.writeFile(cartFile, JSON.stringify(cart), (err1) => {
                console.log(err1);
            });
        });
    };

    static removeProduct = (id, productPrice, cb) => {
        id = parseInt(id);
        productPrice = parseInt(productPrice);
        getCartFromFile((cart) => {
            cart.products = [...cart.products];

            const index = cart.products.findIndex(
                (product) => product.id === id
            );
            console.log(cart);
            console.log(index);
            if (index >= 0) {
                cart.totalPrice -= cart.products[index].qty * productPrice;

                cart.products.splice(index, 1);
            } else {
            }
            fs.writeFile(cartFile, JSON.stringify(cart), (err1) => {
                console.log(err1);
                cb();
            });
        });
    };
};
