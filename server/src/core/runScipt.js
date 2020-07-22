const moment = require("moment");
const config = require("../config");
const mongodb = require("./connectToMongoDB");
const logger = require("./logger");

process.on("unhandledRejection", (e) => console.log(e));
process.on("uncaughtException", (e) => console.log(e));

const createTimer = () => {
  let launchTime;
  return {
    start: () => {
      launchTime = new Date().getTime();
    },
    stop: (results) => {
      let duration = moment.utc(new Date().getTime() - launchTime).format("HH:mm:ss.SSS");
      let data = results && results.toJSON ? results.toJSON() : results;
      console.log(JSON.stringify(data || {}, null, 2));
      console.log(`Completed in ${duration}`);
    },
  };
};

const exit = async (rawError, client) => {
  let error = rawError;
  if (rawError) {
    logger.error(rawError.constructor.name === "EnvVarError" ? rawError.message : rawError);
  }

  setTimeout(() => {
    //Waiting logger to flush all logs (MongoDB)
    let closed = client ? client.close() : Promise.resolve();
    closed.catch((closeError) => {
      error = closeError;
      console.log(error);
    });
  }, 250);

  process.exitCode = error ? 1 : 0;
};

module.exports = async (job) => {
  try {
    let timer = createTimer();
    timer.start();

    let { client, db } = await mongodb();

    let results = await job({ config, db });

    timer.stop(results);
    await exit(null, client);
  } catch (e) {
    await exit(e);
  }
};
