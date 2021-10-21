const fs = require("fs");
const path = require("path");
const fsPromise = require("fs/promises");

async function deleteApifyData() {
  const directory = "./apify_storage/datasets/default";
  if (fs.existsSync(directory)) {
    const files = await fsPromise.readdir(directory);
    for (const file of files) {
      fs.unlink(`./apify_storage/datasets/default/${file}`, (err) => {
        if (err) throw err;
      });
    }
  }

  const keyValueDirectory = "./apify_storage/key_value_stores/default";
  if (fs.existsSync(keyValueDirectory)) {
    const files = await fsPromise.readdir(keyValueDirectory);
    for (const file of files) {
      fs.unlink(`./apify_storage/key_value_stores/default/${file}`, (err) => {
        if (err) throw err;
      });
    }
  }

  const requestQueueDirectory = "./apify_storage/request_queues/default";
  if (fs.existsSync(requestQueueDirectory)) {
    const files = await fsPromise.readdir(requestQueueDirectory);
    for (const file of files) {
      fs.unlink(`./apify_storage/request_queues/default/${file}`, (err) => {
        if (err) throw err;
      });
    }
  }
}


module.exports = deleteApifyData;
