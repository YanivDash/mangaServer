import axios from "axios";
import cheerio from "cheerio";

const scraper = async (url, elemClass) => {
  const elemClass = "jpg";
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
    let searchRegex = `img[src*=${searchClass}]`;
    if (currentIndex > 3) {
      searchRegex = `img[src]`;
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
      const totalChapters = data.length + 1;
      const firstChapter = data[data.length - 1];
      const lastChapter = data[0];
      return { totalChapters, firstChapter, lastChapter };
    } else {
      return "failed to load chapters";
    }
  } catch (error) {
    console.log(error);
  } finally {
    return;
  }
};

const updateChapter = async (mangaLink, mangaClass, totalChapter) => {
  let currentTotalChapter = 0;
  const regex = /chapterNumberHere/;
  let typeUrl = mangaLink.replace(regex, `8010268116`);
  const typeRegex = /8010268116/;

  let leap = 10;
  let newUrl = mangaLink.replace(regex, `${totalChapter}`);

  let match = totalChapter;
  let imageUrl;

  while (true) {
    try {
      const response = await axios.get(newUrl);
      const $ = cheerio.load(response.data);
      const images = $(mangaClass);
      imageUrl = $(images[0]).attr("src");
    } catch (error) {
      imageUrl = "";
    }
    let numNow = new RegExp(`${match}`);
    if (imageUrl) {
      newUrl = typeUrl.replace(typeRegex, `${match + leap}`);
      match = match + leap;
    } else if (leap === 10) {
      newUrl = typeUrl.replace(typeRegex, `${match - 10}`);
      leap = 1;
      match = match - 10;
    } else {
      currentTotalChapter = match - 1;
      break;
    }
  }

  console.log({ total: currentTotalChapter });
  return currentTotalChapter;
};
export { scraper, scrapeTotal, updateChapter };

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
