const Cart = require('./cart');
const db = require('../utils/database');

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id ? parseInt(id) : null;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price ? parseInt(price) : null;
    }

    save() {
        if (this.id) {
            return db.execute(
                `UPDATE products SET title = "${this.title}", imageUrl="${this.imageUrl}", description="${this.description}",price=${this.price} WHERE id = ${this.id}`
            );
        }
        return db.execute(
            `INSERT INTO products(title,imageUrl,description,price) VALUES ("${this.title}","${this.imageUrl}","${this.description}",${this.price})`
        );
    }

    static fetchAll = () => {
        return db.execute('SELECT * FROM products');
    };
    static findById = (id) => {
        return db.execute(`SELECT * FROM products WHERE id = ${id}`);
    };

    static deleteById = (id) => {};
};
