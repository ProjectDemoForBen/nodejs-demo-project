const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    cart: {
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
});

userSchema.methods.deleteItemFromCart = function (itemId) {
    const updatedCartItems = this.cart.items.filter(
        (item) => item._id.toString() !== itemId.toString()
    );

    this.cart = { items: updatedCartItems };

    return this.save();
};

userSchema.methods.addToCart = function (product) {
    const index = this.cart.items.findIndex(
        (cartProduct) =>
            cartProduct.productId.toString() === product._id.toString()
    );

    let updatedCartItems = [...this.cart.items];

    if (index >= 0) {
        updatedCartItems[index].quantity++;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: 1,
        });
    }

    this.cart = { items: updatedCartItems };
    return this.save();
};
module.exports = mongoose.model('User', userSchema);

// const mongoDb = require('mongodb');
// const { getDb } = require('../utils/database');
//
// const collection = 'users';
// class User {
//     constructor(id, name, email, cart) {
//         this._id = id ? mongoDb.ObjectID(id) : null;
//         this.name = name;
//         this.email = email;
//         this.cart = cart ? cart : { items: [] };
//     }
//
//     addToCart(product) {
//     }
//
//     getCart() {
//
//     }
//
//     deleteItemFromCart(productId) {
//     }
//
//     addOrder() {
//         const db = getDb();
//
//         return this.getCart()
//             .then((items) => {
//                 const order = {
//                     ...items,
//                     user: {
//                         _id: this._id,
//                         name: this.name,
//                         email: this.email,
//                     },
//                 };
//
//                 return db.collection('orders').insertOne(order);
//             })
//             .then((result) => {
//                 return db.collection('users').updateOne(
//                     {
//                         _id: this._id,
//                     },
//                     {
//                         $set: {
//                             cart: {
//                                 items: [],
//                             },
//                         },
//                     }
//                 );
//             });
//     }
//
//     getOrders() {
//         const db = getDb();
//
//         return db
//             .collection('orders')
//             .find({
//                 'user._id': this._id,
//             })
//             .toArray();
//     }
//
//     save() {
//         const db = getDb();
//         const dbCollection = db.collection(collection);
//
//         if (this._id) {
//             return dbCollection.updateOne({ _id: this._id }, { $set: this });
//         } else {
//             return dbCollection.insertOne(this);
//         }
//     }
//
//     static findById(id) {
//         const db = getDb();
//         return db
//             .collection(collection)
//             .find({ _id: new mongoDb.ObjectID(id) })
//             .next();
//     }
// }
//
// module.exports = User;
