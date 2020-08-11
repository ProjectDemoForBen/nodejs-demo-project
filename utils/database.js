const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const url = 'mongodb://root:example@localhost:27017';

let _db = undefined;

const mongoConnect = (cb) => {
    MongoClient.connect(url)
        .then((client) => {
            console.log('connected');
            // db is created on the fly
            _db = client.db('prueba');
            cb();
        })
        .catch((error) => {
            console.log('error', error);
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No db';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
