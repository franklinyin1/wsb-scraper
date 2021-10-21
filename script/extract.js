const fsPromise = require("fs/promises");
const fs = require("fs");

const outputTxt = "./output.txt";

async function extract() {
  if (fs.existsSync(outputTxt)) {
    await fsPromise.rm(outputTxt)
  }
  var stream = await fs.createWriteStream("./output.txt", {flags:'a'});
  const files = await fsPromise.readdir("./apify_storage/datasets/default");
  for (const file of files) {
    let text = await fsPromise.readFile(`./apify_storage/datasets/default/${file}`, 'utf8', async (err, data) => {
      if (err) throw err
    })
    await stream.write(JSON.stringify(text))
  };
  await stream.end();
  console.log('extraction complete')
}

module.exports = extract
