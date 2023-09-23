import axios from "axios";
import cheerio from "cheerio";

const scraper = async (url, elemClass) => {
  let data = [];
  let currentIndex = 0;

  let imgType = ["", "jpg", "jpeg", "chapter", "png"];

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
        const imageUrl = $(element).attr("data-lazy-src");
        if (imageUrl) {
          let cleanedLink = imageUrl.replace(/\t/g, "").replace(/\n/g, "");
          data.push(cleanedLink);
        }
      });

      if (data.length > 4) {
        console.log(`elemments with class ${searchRegex}`);
      } else {
        console.log(
          `No img elemments with class ${searchRegex} found on the page.`
        );
      }
    } catch (error) {
      console.log(error);
      return;
    } finally {
      currentIndex = currentIndex + 1;

      if (data.length > 5 || currentIndex > 4) {
        console.log(data);
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

    if (data.length > 3) {
      return data;
    } else {
      return "failed to load chapters";
    }
  } catch (error) {
    console.log(error);
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
    console.log(url);
    console.log("error in scraper.js : updateChapter");
  }
};

export { scraper, scrapeTotal, scrapeLinks, updateChapter };
