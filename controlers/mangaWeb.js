import db from "../database/dbConnection.js";
import { scrapTotal } from "../scrapper.js";
const mangaWeb = async (values) => {
  const valuesArray = [
    values.websiteName,
    values.mangaName,
    values.mangaCover,
    values.mangaLink,
    values.mangaClass,
  ];
  let totalChapterD = 0;
  await scrapTotal(values.mangaLink, values.mangaClass).then((d) => {
    valuesArray.push(d);
    totalChapterD = d;
  });

  let message;

  if (totalChapterD < -1) {
    message = "could not scrape total chapter";
    console.log(message);
    return message;
  }

  const sql = `INSERT INTO mangalist (\`websiteName\`, \`mangaName\`, \`mangaCover\`, \`mangaLink\`, \`mangaClass\`,\`totalChapter\`)VALUES (?, ?, ?, ?, ?, ?)`;

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(sql, valuesArray, (err, result) => {
        if (result) {
          resolve(result);
        } else {
          reject("error");
        }
      });
    });

    if (result) {
      const message = `successfully added to dataBase`;
      return message;
    }
  } catch (error) {
    const message = `error while inserting to database`;
    return message;
  }

  return;
};

export default mangaWeb;
