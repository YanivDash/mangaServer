import db from "../database/dbConnection.js";

const updateTotalChapter = async (values) => {
  const id = values.id;
  const newTotalChapter = values.newTotalChapter;
  const totalChapter = values.totalChapter;
  let sql;

  if (newTotalChapter > totalChapter) {
    sql = `UPDATE mangalist
    SET totalChapter = ${newTotalChapter}, 
    dateUpdate = CURRENT_TIMESTAMP
    WHERE id = ${id};
    `;
  } else {
    return;
  }

  db.query(sql, (err, result) => {
    if (result) {
      const message = `${id}:${totalChapter}`;
      return message;
    } else {
      console.log(err);
      const message = "error";
      return message;
    }
  });
};

export default updateTotalChapter;
