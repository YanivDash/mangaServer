import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  db.connect(function (err) {
    if (err) {
      console.log("error when connecting to db:", err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log("Connected to the database");
    }
  });

  db.on("error", function (err) {
    console.log("db error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Reconnecting to the database...");
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

export default db;

// import mysql from "mysql";
// import dotenv from "dotenv";
// dotenv.config();

// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

// db.connect(function (err) {
//   if (err) {
//     console.log("error when connecting to db:", err);
//     setTimeout(function () {
//       db.connect(function (err) {
//         if (err) {
//           console.log("Error while reconnecting:", err);
//         } else {
//           console.log("Reconnected to the database");
//         }
//       });
//     }, 2000);
//   } else {
//     console.log("Connected to the database");
//   }
// });

// db.on("error", function (err) {
//   console.log("db error", err);
//   if (err.code === "PROTOCOL_CONNECTION_LOST") {
//     // Attempt to reconnect
//     db.connect(function (err) {
//       if (err) {
//         console.log("Error while reconnecting:", err);
//       } else {
//         console.log("Reconnected to the database");
//       }
//     });
//   } else {
//     throw err;
//   }
// });
// export default db;
