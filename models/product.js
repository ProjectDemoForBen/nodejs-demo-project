const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// even though nosql is schemaless there is always a structure, mongoose gives the flexibility to access the
// properties which are optional (by default)
// _id: will be added automatically
const productSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Product', productSchema);
