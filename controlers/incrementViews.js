import db from "../database/dbConnection.js";

const incrementViews = async (values) => {
  const id = values.id;
  const totalViews = values.totalViews;

  const sql = `UPDATE mangalist
  SET totalViews = ${totalViews + 1}
  WHERE id = ${id};
  `;

  db.query(sql, (err, result) => {
    if (result) {
      const message = "succesfull";
      return message;
    } else {
      console.log(err);
      const message = "error";
      return message;
    }
  });
};

export default incrementViews;
