const mongoDb = require('mongodb');
const { getDb } = require('../utils/database');

const collection = 'users';
class User {
    constructor(id, name, email) {
        this._id = id ? mongoDb.ObjectID(id) : null;
        this.name = name;
        this.email = email;
    }

    save() {
        const db = getDb();
        const dbCollection = db.collection(collection);

        if (this._id) {
            return dbCollection.updateOne({ _id: this._id }, { $set: this });
        } else {
            return dbCollection.insertOne(this);
        }
    }

    static findById(id) {
        const db = getDb();
        return db
            .collection(collection)
            .find({ _id: new mongoDb.ObjectID(id) })
            .next();
    }
}

module.exports = User;
