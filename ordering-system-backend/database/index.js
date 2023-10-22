const mysql = require("mysql2");

const db = mysql.createPool({
  host: "ordering-system-mysql",
  user: "root",
  password: "187139",
  database: "ordering-system",
});

module.exports = db;
