import axios from "axios";
import cheerio from "cheerio";

const scraper = async (url, elemClass) => {
  let data = [];
  let currentIndex = 0;

  let imgType = ["", "jpg", "jpeg", "chapter"];

  imgType[0] = elemClass;
  imgType = Array.from(new Set(imgType));

  while (true) {
    const searchClass = imgType[currentIndex];
    let searchRegex = `img[src$=${searchClass}]`;
    if (currentIndex > 2) {
      searchRegex = `img`;
    }

    try {
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const images = $(searchRegex);

      images.each(async (index, element) => {
        const imageUrl = $(element).attr("src");
        const regex = /\.png$/;
        if (imageUrl) {
          if (!regex.test(imageUrl)) {
            let cleanedLink = imageUrl.replace(/\t/g, "").replace(/\n/g, "");
            data.push(cleanedLink);
          }
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

    function extractNumberFromLink(link) {
      const re = /chapter[\W0-9]*[a-z]|chapter.*/gi;
      const newStr = link.match(re)[0];
      const reg = /\d+/g;
      const num = newStr
        .match(reg)
        ?.sort((a, b) => parseInt(b) - parseInt(a))[0];
      if (num >= 0) {
        return num;
      } else {
        return -1;
      }
    }

    data.sort((a, b) => extractNumberFromLink(b) - extractNumberFromLink(a));

    while (true) {
      const re = /chapter.*/gi;
      const newStr = data[data.length - 1].match(re)[0];
      const reg = /\d+/g;
      const num = newStr.match(reg);
      if (!num) {
        console.log(data.splice(-1));
      } else {
        break;
      }
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
    return "error in scrapper.js : scrapeTotal";
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

    function extractNumberFromLink(link) {
      const re = /chapter[\W0-9]*[a-z]|chapter.*/gi;
      const newStr = link.match(re)[0];
      const reg = /\d+/g;
      const num = newStr
        .match(reg)
        ?.sort((a, b) => parseInt(b) - parseInt(a))[0];
      if (num >= 0) {
        return num;
      } else {
        return -1;
      }
    }

    data.sort((a, b) => extractNumberFromLink(b) - extractNumberFromLink(a));

    while (true) {
      const re = /chapter.*/gi;
      const newStr = data[data.length - 1].match(re)[0];
      const reg = /\d+/g;
      const num = newStr.match(reg);
      if (!num) {
        console.log(data.splice(-1));
      } else {
        break;
      }
    }

    if (data.length > 3) {
      console.dir(data, { maxArrayLength: null });
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

    data = Array.from(new Set(data));

    function extractNumberFromLink(link) {
      const re = /chapter[\W0-9]*[a-z]|chapter.*/gi;
      const newStr = link.match(re)[0];
      const reg = /\d+/g;
      const num = newStr
        .match(reg)
        ?.sort((a, b) => parseInt(b) - parseInt(a))[0];
      if (num >= 0) {
        return num;
      } else {
        return -1;
      }
    }

    data.sort((a, b) => extractNumberFromLink(b) - extractNumberFromLink(a));

    while (true) {
      const re = /chapter.*/gi;
      const newStr = data[data.length - 1].match(re)[0];
      const reg = /\d+/g;
      const num = newStr.match(reg);
      if (!num) {
        console.log(data.splice(-1));
      } else {
        break;
      }
    }

    if (data.length > 1) {
      console.log([data.length, data[0]]);
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
