import db from "../database/dbConnection.js";

const getAllManga = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM mangalist`;
    db.query(sql, (error, result) => {
      db.release();
      if (error) {
        console.error("Error executing the query:", error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export default getAllManga;
