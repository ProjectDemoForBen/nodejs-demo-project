const mongoDb = require('mongodb');
const { getDb } = require('../utils/database');

const collection = 'users';
class User {
    constructor(id, name, email, cart) {
        this._id = id ? mongoDb.ObjectID(id) : null;
        this.name = name;
        this.email = email;
        this.cart = cart ? cart : { items: [] };
    }

    addToCart(product) {
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

        const db = getDb();
        return db
            .collection(collection)
            .updateOne(
                { _id: this._id },
                { $set: { cart: { items: updatedCartItems } } }
            );
    }

    getCart() {
        const db = getDb();
        const cartProductsId = this.cart.items.map((item) => item.productId);

        return db
            .collection('products')
            .find({
                _id: { $in: cartProductsId },
            })
            .toArray()
            .then((products) => {
                return {
                    items: products.map((product) => {
                        const cartProduct = this.cart.items.find(
                            (item) =>
                                item.productId.toString() ===
                                product._id.toString()
                        );
                        return { ...product, quantity: cartProduct.quantity };
                    }),
                };
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(
            (item) => item.productId.toString() !== productId.toString()
        );

        const db = getDb();
        return db.collection(collection).updateOne(
            {
                _id: this._id,
            },
            {
                $set: {
                    cart: {
                        items: updatedCartItems,
                    },
                },
            }
        );
    }

    addOrder() {
        const db = getDb();

        return this.getCart()
            .then((items) => {
                const order = {
                    ...items,
                    user: {
                        _id: this._id,
                        name: this.name,
                        email: this.email,
                    },
                };

                return db.collection('orders').insertOne(order);
            })
            .then((result) => {
                return db.collection('users').updateOne(
                    {
                        _id: this._id,
                    },
                    {
                        $set: {
                            cart: {
                                items: [],
                            },
                        },
                    }
                );
            });
    }

    getOrders() {
        const db = getDb();

        return db
            .collection('orders')
            .find({
                'user._id': this._id,
            })
            .toArray();
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
