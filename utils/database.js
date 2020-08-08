const mysql = require('mysql2');

const pool = mysql.createPool({
    database: 'mysql',
    host: 'localhost',
    user: 'root',
    password: '1234',
});

module.exports = pool.promise();
