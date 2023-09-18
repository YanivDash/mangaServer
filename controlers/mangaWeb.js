import db from "../database/dbConnection.js";
import { scrapeTotal } from "../scrapper.js";

const mangaWeb = async (values) => {
  const valuesArray = [
    values.websiteName,
    values.mangaName,
    values.mangaCover,
    values.mangaClass,
  ];
  let totalChapterD = 0;
  await scrapeTotal(values.websiteName).then((d) => {
    console.log(d);
    valuesArray.push(d.totalChapters);
    valuesArray.push(d.firstChapter);
    valuesArray.push(d.lastChapter);
    totalChapterD = d.totalChapters;
  });

  let message;

  if (totalChapterD < -1 || totalChapterD > 5500) {
    message = "could not scrape total chapter";
    console.log(message);
    return message;
  }

  const sql = `INSERT INTO mangalist (\`websiteName\`, \`mangaName\`, \`mangaCover\`, \`mangaClass\`,\`totalChapter\`,\`firstChapter\`,\`lastChapter\`) VALUES (?, ?, ?, ?, ?, ? ,?)`;

  try {
    const result = await new Promise((resolve, reject) => {
      db.query(sql, valuesArray, (err, result) => {
        if (err) {
          reject("error");
        } else {
          resolve(result);
        }
      });
    });

    if (result) {
      const message = `successfully added to dataBase`;
      console.log(result);
      db.end();
      return message;
    } else {
      return "check the database";
    }
  } catch (error) {
    console.log(error);
    const message = `error while inserting to database`;
    db.end();
    return message;
  }

  return;
};

export default mangaWeb;
