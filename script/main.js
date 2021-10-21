const deleteApifyData = require("./delete");
const extract = require("./extract");
const process = require("./process");
const { seed, runSeed } = require("./seed");

const fs = require("fs");
const path = require("path");
const fsPromise = require("fs/promises");
const natural = require("natural");
const Analyzer = require("natural").SentimentAnalyzer;
const stemmer = require("natural").PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");

const Apify = require("apify");
const { puppeteer } = Apify.utils;
const {
  utils: { log },
} = Apify;

const {
  db,
  models: { Stock },
} = require("../server/db");

const schedule = require("node-schedule");

const rule = new schedule.RecurrenceRule();
rule.minute = 39;

const job = schedule.scheduleJob(rule, async function () {
  await deleteApifyData();

  const requestQueue = await Apify.openRequestQueue();
  await requestQueue.addRequest({
    url: "https://www.reddit.com/r/wallstreetbets/",
  });

  // Create an instance of the PuppeteerCrawler class - a crawler
  // that automatically loads the URLs in headless Chrome / Puppeteer.
  const crawler = new Apify.PuppeteerCrawler({
    requestQueue,

    // Here you can set options that are passed to the Apify.launchPuppeteer() function.
    launchContext: {
      launchOptions: {
        headless: true,
        // Other Puppeteer options
      },
    },

    maxRequestsPerCrawl: 500,

    // This function will be called for each URL to crawl.
    // Here you can write the Puppeteer scripts you are familiar with,
    // with the exception that browsers and pages are automatically managed by the Apify SDK.
    // The function accepts a single parameter, which is an object with the following fields:
    // - request: an instance of the Request class with information such as URL and HTTP method
    // - page: Puppeteer's Page object (see https://pptr.dev/#show=api-class-page)
    handlePageFunction: async ({ request, page }) => {
      console.log(`Processing ${request.url}...`);

      if (request.userData.detailPage) {
        console.log("entered Details");
        const urlArr = request.url.split("/").slice(-3);

        log.debug("Scraping results.");

        const data = await page.$$eval(".u35lf2ynn4jHsVUwPmNU", ($posts) => {
          let scrapedData = {};
          $posts.forEach(($post) => {
            scrapedData.title = $post.querySelector(
              "h1._eYtD2XCVieq6emjKBH3m"
            ).innerText;
            scrapedData.postContent = $post.querySelector(
              "._1qeIAgB0cPwnLhDF9XSiJM"
            ).innerText;
          });
          return scrapedData;
        });

        log.debug("Pushing data to dataset.");
        await Apify.pushData(data);
      }

      if (!request.userData.detailPage) {
        let seconds = 50;
        console.log("Scrolling for", seconds, "seconds");
        await puppeteer.infiniteScroll(page, { timeoutSecs: seconds });

        // A function to be evaluated by Puppeteer within the browser context.

        await Apify.utils.enqueueLinks({
          page,
          requestQueue,
          selector: "._3jOxDPIQ0KaOWpzvSQo-1s",
          transformRequestFunction: (req) => {
            req.userData.detailPage = true;
            return req;
          },
        });
      }
    },

    // This function is called if the page processing failed more than maxRequestRetries+1 times.
    handleFailedRequestFunction: async ({ request }) => {
      console.log(`Request ${request.url} failed too many times.`);
    },
  });

  // Run the crawler and wait for it to finish.
  await crawler.run();

  console.log("Crawler finished.");

  const outputTxt = "./output.txt";
  await extract();

  const path = "./processedOutput.txt";
  await process();

  await runSeed();
});
