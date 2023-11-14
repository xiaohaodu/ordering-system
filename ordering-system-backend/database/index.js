const mysql = require("mysql2");

let db;
if (process.env.NODE_ENV === "production") {
  db = mysql.createPool({
    host: "ordering-system-mysql",
    user: "root",
    password: "187139",
    database: "ordering-system",
  });
} else {
  db = mysql.createPool({
    host: "127.0.0.1",
    user: "root",
    password: "187139",
    database: "backend",
  });
}
module.exports = db;
