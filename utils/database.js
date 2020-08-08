const Sequelize = require('sequelize');

// sets up connection pool
const sequelize = new Sequelize('mysql', 'root', '1234', {
    dialect: 'mysql',
    host: 'localhost',
});

module.exports = sequelize;
