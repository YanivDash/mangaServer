import db from "../database/dbConnection.js";

const updateTotalChapter = async (values) => {
  const id = values.id;
  const newTotalChapter = values.newTotalChapter;
  const totalChapter = values.totalChapter;
  let sql;

  if (newTotalChapter.numberOfChapter > totalChapter) {
    sql = `UPDATE mangalist
    SET lastChapter = ?,
    totalChapter = ?,
    dateUpdate = CURRENT_TIMESTAMP
    WHERE id = ?;`;
  } else {
    return;
  }

  // db.query(sql, (err, result) => {
  //   db.release();
  //   if (result) {
  //     const message = `${id}:${totalChapter}`;
  //     return message;
  //   } else {
  //     console.log(err);
  //     const message = "error";
  //     return message;
  //   }
  // });

  try {
    db.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting database connection:", err);
        return reject(err);
      }
      connection.query(
        sql,
        [newTotalChapter[1], newTotalChapter[0], id],
        (error, result) => {
          connection.release();

          if (error) {
            console.error("Error executing the query:", error);
            return reject(error);
          }

          const message = `${id}:${newTotalChapter}`;
          resolve(message);
          if (result) {
            return message;
          }
        }
      );
    });
  } catch (error) {
    console.log("error in updateTotalChapter");
  }
};

export default updateTotalChapter;
