import db from "../database/dbConnection.js";

const getAllManga = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM mangalist`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        if (db && db.state !== "disconnected") {
          db.end((err) => {
            if (err) {
              console.error("Error closing the database connection:", err);
            }
            console.log("Database connection closed");
          });
        }
        reject(err);
      } else {
        if (db && db.state !== "disconnected") {
          db.end((err) => {
            if (err) {
              console.error("Error closing the database connection:", err);
            }
            console.log("Database connection closed");
          });
        }
        resolve(result);
      }
    });
  });
};

export default getAllManga;
