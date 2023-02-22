const mongoose = require("mongoose");

module.exports = ({ uri }) =>
  new Promise((resolve, reject) => {
    let retries = 0;

    const retry = (delay, maxRetries) => {
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
        if (err) {
          if (retries > maxRetries) {
            reject(err);
          }

          console.log(`Failed to connect to MongoDB - retrying in ${delay} sec`, err.message);

          retries++;
          setTimeout(() => retry(1000, 120), delay);
        } else {
          resolve(client);
        }
      });
    };

    retry(1000, 120); //wait for 2 minutes
  });
