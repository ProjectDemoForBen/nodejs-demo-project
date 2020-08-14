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
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // name of the model to which the ObjectID is related
        required: true,
    },
});

// connects schema to a name
// the table name is the name lower-case with an s
module.exports = mongoose.model('Product', productSchema);
