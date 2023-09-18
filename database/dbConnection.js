import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect(function (err) {
  if (err) {
    console.log("error when connecting to db:", err);
    setTimeout(db, 2000);
  }
});

db.on("error", function (err) {
  console.log("db error", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    db();
  } else {
    throw err;
  }
});

export default db;
