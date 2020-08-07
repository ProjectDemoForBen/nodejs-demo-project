const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

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
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save = () => {
        getProductsFromFile((products) => {
            this.id = products.length + 1;
            products.push(this);

            fs.writeFile(productsFile, JSON.stringify(products), (err1) => {
                console.log(err1);
            });
        });
    };

    static fetchAll = (cb) => {
        getProductsFromFile(cb);
    };
    static findById = (id, cb) => {
        getProductsFromFile((products) => {
            cb(products.find((product) => product.id === parseInt(id)));
        });
    };
};
