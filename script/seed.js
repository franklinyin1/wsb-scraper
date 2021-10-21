'use strict';

const fsPromise = require("fs/promises");

const {
  db,
  models: { Stock},
} = require('../server/db');

async function seed() {
  await db.sync({force: true})
  console.log('db synced!')

  //Database seeding
  let seedData = await fsPromise.readFile("./processedOutput.txt", "utf8")
  let seedObject = JSON.parse(seedData)
  const stocks = await Promise.all(
    Object.keys(seedObject).map((stock) => {
      return Stock.create({
        ticker: stock,
        references: seedObject[stock].references,
        sentiment: seedObject[stock].sentiment,
        companyName: seedObject[stock].companyName,
        avgSentiment: seedObject[stock].sentiment / seedObject[stock].references
      })
    })
  )

  console.log('seeded successfully')
}

async function runSeed() {
  console.log('seeding...')
  try{
    await seed()
  } catch(err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = {seed, runSeed};
