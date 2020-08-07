const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const Cart = require('./cart');

const productsFile = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    fs.readFile(productsFile, (err, data) => {
        if (err) {
            cb([]);
            return;
        }
        cb(JSON.parse(data));
    });
};

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id ? parseInt(id) : null;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile((products) => {
            if (this.id) {
                const index = products.findIndex(
                    (product) => product.id === this.id
                );
                products[index] = this;
            } else {
                if (products.length === 0) {
                    this.id = 1;
                } else {
                    this.id = products[products.length - 1].id + 1;
                }
                products.push(this);
            }
            console.log(products);
            fs.writeFile(productsFile, JSON.stringify(products), (err1) => {
                if (!err1) {
                } else {
                    console.log(`error saving products: ${err1}`);
                }
            });
        });
    }

    static fetchAll = (cb) => {
        getProductsFromFile(cb);
    };
    static findById = (id, cb) => {
        id = parseInt(id);
        getProductsFromFile((products) => {
            cb(products.find((product) => product.id === id));
        });
    };

    static deleteById = (id, cb) => {
        id = parseInt(id);
        getProductsFromFile((products) => {
            const index = products.findIndex((product) => product.id === id);
            const product = products[index];
            products.splice(index, 1);
            fs.writeFile(productsFile, JSON.stringify(products), (err1) => {
                if (!err1) {
                    console.log('no error removing product');
                    Cart.removeProduct(id, product.price, cb);
                } else {
                    console.log(`error saving products: ${err1}`);
                    cb();
                }
            });
        });
    };
};
