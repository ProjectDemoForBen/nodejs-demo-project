const mongoDb = require('mongodb');
const getDb = require('../utils/database').getDb;

const collection = 'products';

class Product {
    constructor(id, title, price, imageUrl, description) {
        this._id = id ? mongoDb.ObjectID(id) : null;
        this.title = title;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
    }

    save() {
        const db = getDb();
        const dbCollection = db.collection(collection);
        if (this._id) {
            return dbCollection.updateOne(
                {
                    _id: this._id,
                },
                {
                    $set: this,
                }
            );
        } else {
            return dbCollection.insertOne(this);
        }
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

    static deleteById(id) {
        const db = getDb();
        return db
            .collection(collection)
            .deleteOne({ _id: new mongoDb.ObjectID(id) });
    }
}

module.exports = Product;
