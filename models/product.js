const mongoDb = require('mongodb');
const getDb = require('../utils/database').getDb;

const collection = 'products';

class Product {
    constructor(title, price, imageUrl, description) {
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        const db = getDb();

        return db.collection(collection).insertOne(this);
    }

    static fetchAll() {
        const db = getDb();

        // .find({title: 'book'}) // find products that has book as a title

        return db
            .collection(collection)
            .find() // returns a cursor (uses pagination)
            .toArray(); // return all elements (promise);
    }

    static findById(id) {
        const db = getDb();
        return db
            .collection(collection)
            .find({ _id: new mongoDb.ObjectID(id) }) // because the _id is stored as an ObjectId
            .next();
    }
}

module.exports = Product;
