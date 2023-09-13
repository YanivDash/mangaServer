import db from "../database/dbConnection.js";

const getAllManga = () => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM mangalist`;
    db.query(sql, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

export default getAllManga;
