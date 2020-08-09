const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const CartItem = sequelize.define('cart_item', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

module.exports = CartItem;
