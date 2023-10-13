const mysql = require("mysql2");

const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "187139",
  database: "backend",
});

module.exports = db;
