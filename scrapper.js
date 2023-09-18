import axios from "axios";
import cheerio from "cheerio";

console.log("error in this scrapper file");

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
    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
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
        totalChapters: data.length + 1,
        firstChapter: data[data.length - 1],
        lastChapter: data[0],
      });
      return {
        totalChapters: data.length + 1,
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
  url = "https://tomodachimanga.com/";
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
      const regex = /chapter-(\d+)/;
      const extractLargestChapterNumber = (link) => {
        const matches = link.match(regex);
        if (!matches) return -1; // Return -1 for links without chapter numbers
        const numericValues = matches.map((match) => parseInt(match, 10));
        return numericValues.length > 0 ? Math.max(...numericValues) : -1;
      };

      data.sort((a, b) => {
        const largestChapterNumberA = extractLargestChapterNumber(a);
        const largestChapterNumberB = extractLargestChapterNumber(b);

        // Compare the largest chapter numbers, treating -1 as a special case
        if (largestChapterNumberA === -1 && largestChapterNumberB === -1)
          return 0;
        if (largestChapterNumberA === -1) return 1;
        if (largestChapterNumberB === -1) return -1;

        return largestChapterNumberB - largestChapterNumberA;
      });
    }

    // if (match) {
    //   function extractNumberFromLink(link) {
    //     const match = link.match(/chapter[-\s]*([\d]+)/); // Match the last sequence of digits
    //     return match ? parseInt(match[1]) : Infinity; // Use Infinity for links without a number
    //   }
    //   data.sort((a, b) => extractNumberFromLink(b) - extractNumberFromLink(a));
    // }

    if (data.length > 3) {
      console.log(data);
      return data;
    } else {
      return "failed to load chapters";
    }
  } catch (error) {
    console.log(error);
    console.log(url);
  }
};
scrapeLinks();

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
