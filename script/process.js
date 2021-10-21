const natural = require("natural");
const fsPromise = require("fs/promises");
const fs = require("fs");
const Analyzer = require("natural").SentimentAnalyzer;
const stemmer = require("natural").PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");

async function process() {
  const tokenizer = new natural.RegexpTokenizer({ pattern: /\""/ });
  const lineTokenizer = new natural.RegexpTokenizer({ pattern: /\n/ });
  const tTokenizer = new natural.RegexpTokenizer({ pattern: /\t/})
  const wordTokenizer = new natural.WordTokenizer();

  let text = await fsPromise.readFile("./output.txt", "utf8");
  let tickers = await fsPromise.readFile("./NYSEstocksymbols.txt", "utf8");
  let companyNames = await fsPromise.readFile("./NYSEstocknames.txt", "utf8");

  let postsArray = tokenizer.tokenize(text);
  let tickersArray = lineTokenizer.tokenize(tickers);
  let tokenizedCompanyNames = lineTokenizer.tokenize(companyNames);
  tickersWithCompanyNames = tokenizedCompanyNames.map((stock) => tTokenizer.tokenize(stock))

  let referenceTracker = {};

  tickersArray.forEach((stockSymbol) => {
    referenceTracker[stockSymbol] = { references: 0, sentiment: 0 };
  });

  parsedPosts = postsArray.map((text) => {
    return wordTokenizer.tokenize(text);
  });

  await parsedPosts.forEach((arrayOfWords) => {
    arrayOfWords.forEach((word) => {
      if (referenceTracker[word] !== undefined) {
        referenceTracker[word].references++;
        referenceTracker[word].sentiment +=
          analyzer.getSentiment(arrayOfWords);
      }
    });
  });

  Object.keys(referenceTracker).forEach((stockSymbol) => {
    if (referenceTracker[stockSymbol].references === 0) {
      delete referenceTracker[stockSymbol];
    }
  });

  Object.keys(referenceTracker).forEach((stockSymbol) => {
    let companyName = tickersWithCompanyNames.filter(tickerPlusName => tickerPlusName[0] === stockSymbol)
    referenceTracker[stockSymbol].companyName = companyName[0][1]
  })

  const path = "./processedOutput.txt"

  if (fs.existsSync(path)) {
    console.log('entered existsSync')
    await fsPromise.rm(path)
  }
  let stream = fs.createWriteStream("processedOutput.txt", {flags:'a'})
  stream.write(JSON.stringify(referenceTracker))
  stream.end()
  console.log('process complete')
}

module.exports = process
