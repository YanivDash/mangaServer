import mysql from "mysql";
import dotenv from "dotenv";
dotenv.config();

let db;

function createDatabaseConnection() {
  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  db.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      db.end();
      // Handle the connection error, such as attempting to reconnect
      handleConnectionError();
    } else {
      console.log("Connected to the database");
    }
  });

  db.on("error", (err) => {
    console.error("Database error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      db.end();
      // Handle the lost connection, such as attempting to reconnect
      handleConnectionError();
    } else {
      throw err;
    }
  });
}

function handleConnectionError() {
  // Close the current connection
  db.end();

  // Attempt to create a new connection and retry the operation
  createDatabaseConnection();
}

// Initialize the database connection
createDatabaseConnection();

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
