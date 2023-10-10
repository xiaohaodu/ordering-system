const mysql = require('mysql2');

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'order_system',
    password: 'FRWG3fffnRXRrXZK',
    database: 'order_system',
});

module.exports = db;