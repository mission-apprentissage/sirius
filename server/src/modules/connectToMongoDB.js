const mongoose = require("mongoose");

module.exports = ({ uri }) =>
  new Promise((resolve, reject) => {
    let retries = 0;

    const retry = (delay, maxRetries) => {
      mongoose.set("strictQuery", false);
      mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, async (err, client) => {
        if (err) {
          if (retries > maxRetries) {
            reject(err);
          }

          console.log(`Failed to connect to MongoDB - retrying in ${delay} sec`, err.message);
          retries++;
          setTimeout(() => retry(1000, 120), delay);
        } else {
          console.log("Connected to MongoDB");
          try {
            console.log("Migration executed successfully.");
            resolve(client);
          } catch (migrationErr) {
            console.error("Migration failed:", migrationErr);
            reject(migrationErr);
          }
        }
      });
    };

    retry(1000, 120); //wait for 2 minutes
  });
