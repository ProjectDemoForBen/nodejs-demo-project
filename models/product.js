const getDb = require('../utils/database').getDb;

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        const db = getDb();

        return db.collection('products').insertOne(this);
    }
}

module.exports = Product;
