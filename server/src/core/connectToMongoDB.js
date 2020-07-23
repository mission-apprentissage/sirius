const mongodb = require("mongodb");
const defaults = require("../config");

module.exports = (options) =>
  new Promise((resolve, reject) => {
    let retries = 0;
    let uri = options.uri || defaults.mongodb.uri;

    const retry = (delay, maxRetries) => {
      mongodb.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
          if (retries > maxRetries) {
            reject(err);
          }

          if (options.onRetry) {
            options.onRetry(err, { delay });
          }

          retries++;
          setTimeout(() => retry(1000, 120), delay);
        } else {
          resolve(client);
        }
      });
    };

    retry(1000, 120); //wait for 2 minutes
  });
