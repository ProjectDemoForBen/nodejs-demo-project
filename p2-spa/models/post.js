const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Post = sequelize.define('post', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [5]
        }
    },
    content: Sequelize.STRING,
    imageUrl: {
        type: Sequelize.STRING
    }
});


module.exports = Post;