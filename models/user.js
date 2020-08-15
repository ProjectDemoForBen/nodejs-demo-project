const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = require('./order');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
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

userSchema.methods.addOrder = function () {
    return this.populate('cart.items.productId')
        .execPopulate()
        .then((user) => {
            const items = user.cart.items.map((item) => {
                return {
                    productId: { ...item.productId._doc },
                    quantity: item.quantity,
                };
            });

            const order = new Order({
                userId: this._id,
                items: items,
            });

            return order.save().then((result) => {
                this.cart.items = [];
                return this.save();
            });
        });
};

module.exports = mongoose.model('User', userSchema);
