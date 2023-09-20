import axios from "axios";
import cheerio from "cheerio";

const scraper = async (url, elemClass) => {
  let data = [];
  let currentIndex = 0;

  let imgType = ["jpg", "jpeg", "chapter", "png"];
  for (let i = imgType.length - 1; i >= 0; i--) {
    imgType[i + 1] = imgType[i];
  }
  imgType[0] = elemClass;
  imgType = Array.from(new Set(imgType));

  while (true) {
    const searchClass = imgType[currentIndex];
    let searchRegex = `img[src$=${searchClass}]`;
    if (currentIndex > 3) {
      searchRegex = `img`;
    }

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    try {
      const images = $(searchRegex);
      images.each(async (index, element) => {
        const imageUrl = $(element).attr("src");
        // console.log(imageUrl);
        let cleanedLink = imageUrl.replace(/\t/g, "").replace(/\n/g, "");
        data.push(cleanedLink);
      });

      if (data.length > 4) {
        console.log(`elemments with class ${searchClass}`);
        console.log(data);
      } else {
        console.log(
          `No img elemments with class ${searchClass} found on the page.`
        );
      }
    } catch (error) {
      console.log(error);
      return;
    } finally {
      currentIndex = currentIndex + 1;
      if (data.length > 6 || currentIndex > 5) {
        return data;
      }
      if (data.length > 6 || currentIndex > 5) {
        return data;
      }
    }
  }
};

const scrapeTotal = async (url) => {
  const elemClass = "a[href*=chapter]";
  let data = [];

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const totalLink = $(elemClass);
    totalLink.each(async (index, element) => {
      const link = $(element).attr("href");
      data.push(link);
    });

    data = Array.from(new Set(data));
    let match = data[1].match(/(\d+)(?!.*\d)/);
    if (match) {
      function extractNumberFromLink(link) {
        const match = link.match(/(\d+)(?!.*\d)/); // Match the last sequence of digits

        return match ? parseInt(match[1]) : Infinity; // Use Infinity for links without a number
      }

      data.sort((a, b) => extractNumberFromLink(b) - extractNumberFromLink(a));
    }

    if (data.length > 3) {
      console.log({
        totalChapters: data.length,
        firstChapter: data[data.length - 1],
        lastChapter: data[0],
      });
      return {
        totalChapters: data.length,
        firstChapter: data[data.length - 1],
        lastChapter: data[0],
      };
    } else {
      return "failed to load chapters";
    }
  } catch (error) {
    console.log(error);
  }
};

const scrapeLinks = async (url) => {
  const elemClass = "a[href*=chapter]";
  // url = "https://tomodachimanga.com/";

  let data = [];

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const totalLink = $(elemClass);
    totalLink.each(async (index, element) => {
      const link = $(element).attr("href");
      data.push(link);
    });

    let firstTen = data.slice(0, 10);
    let lastTen = data.slice(-10);

    data = Array.from(new Set(data));

    let sortedFirstTen = data.slice(0, 20);
    let sortedLastTen = data.slice(-20);

    firstTen.forEach((item) => {
      if (!item in sortedFirstTen && !item in sortedLastTen) {
        data.append(item);
      }
    });

    lastTen.forEach((item) => {
      if (!item in sortedFirstTen && !item in sortedLastTen) {
        data.push(item);
      }
    });

    if (data.length > 3) {
      console.log(data);
      return data;
    } else {
      return "failed to load chapters";
    }
  } catch (error) {
    console.log("error");
    console.log(url);
  }
};

const updateChapter = async (url) => {
  const elemClass = "a[href*=chapter]";
  let data = [];
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const totalLink = $(elemClass);
    totalLink.each(async (index, element) => {
      const link = $(element).attr("href");
      data.push(link);
    });

    let firstTen = data.slice(0, 10);

    data = Array.from(new Set(data));

    let sortedFirstTen = data.slice(0, 20);
    let sortedLastTen = data.slice(-20);

    firstTen.forEach((item) => {
      if (!item in sortedFirstTen && !item in sortedLastTen) {
        data.append(item);
      }
    });

    if (data.length > 1) {
      return [data.length, data[0]];
    } else {
      console.log("no chapter scraped in updatechapter scrapper.js");
    }
  } catch (err) {
    console.log(err);
  }
};
export { scraper, scrapeTotal, scrapeLinks, updateChapter };

// const scraper = async (url, chapClass) => {
//   const data = [];

//   const response = await axios.get(url);
//   const $ = cheerio.load(response.data);
//   const images = $(chapClass);

//   images.each(async (index, element) => {
//     const imageUrl = $(element).attr("src");
//     let cleanedLink = imageUrl.replace(/\t/g, "").replace(/\n/g, "");
//     data.push(cleanedLink);

//     // Skip if the src attribute is missing or if it's a data URI
//     if (!imageUrl || imageUrl.startsWith("data:")) {
//       return;
//     }
//   });
//   return data;
// };

// const scrapTotal = async (mangaLink, mangaClass) => {
//   let totalChapter = 0;
//   const regex = /chapterNumberHere/;
//   let typeUrl = mangaLink.replace(regex, `8010268116`);
//   const typeRegex = /8010268116/;

//   let leap = 1000;
//   let newUrl = mangaLink.replace(regex, `${1}`);
//   let match = 1;
//   let imageUrl;

//   while (true) {
//     try {
//       const response = await axios.get(newUrl);
//       const $ = cheerio.load(response.data);
//       const images = $(mangaClass);
//       imageUrl = $(images[0]).attr("src");
//     } catch (error) {
//       console.log({ match: "error" });
//       imageUrl = "";
//     }
//     let numNow = new RegExp(`${match}`);
//     if (imageUrl) {
//       newUrl = typeUrl.replace(typeRegex, `${match + leap}`);
//       match = match + leap;
//     } else if (leap === 1000) {
//       newUrl = typeUrl.replace(typeRegex, `${match - 1000}`);
//       match = match - 1000;
//       leap = 500;
//     } else if (leap === 500) {
//       newUrl = typeUrl.replace(typeRegex, `${match - 500}`);
//       leap = 100;
//       match = match - 500;
//     } else if (leap === 100) {
//       newUrl = typeUrl.replace(typeRegex, `${match - 100}`);
//       leap = 10;
//       match = match - 100;
//     } else if (leap === 10) {
//       newUrl = typeUrl.replace(typeRegex, `${match - 10}`);
//       leap = 1;
//       match = match - 10;
//     } else {
//       totalChapter = match - 1;
//       break;
//     }
//   }

//   console.log({ total: totalChapter });
//   return totalChapter;
// };
