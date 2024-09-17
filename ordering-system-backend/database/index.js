const mysql = require("mysql2");

const DBBuilder = () => {
  if (process.env.NODE_ENV === "production") {
    return mysql.createPool({
      host: "ordering-system-mysql",
      user: "root",
      password: "187139",
      database: "ordering-system",
    });
  } else {
    return mysql.createPool({
      host: "127.0.0.1",
      user: "root",
      password: "187139",
      database: "ordering-system",
    });
  }
};
const db = DBBuilder();

module.exports = db;
