const mongodb = require("mongodb");
const logger = require("./logger");
const defaults = require("../config");

const connectToMongoDB = (uri) => {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const retry = (delay, maxRetries) => {
      mongodb.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
          if (retries > maxRetries) {
            reject(err);
          }
          logger.error(`Failed to connect to MongoDB - retrying in ${delay} sec`, err.message);
          retries++;
          setTimeout(() => retry(1000, 120), delay);
        } else {
          resolve(client);
        }
      });
    };

    retry(1000, 120); //wait for 2 minutes
  });
};

module.exports = (uri = defaults.mongodb.uri) => connectToMongoDB(uri);
