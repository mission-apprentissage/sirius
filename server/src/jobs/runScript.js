const moment = require("moment");
const logger = require("../core/logger");
const createComponents = require("../components");

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

const exit = async (rawError, close) => {
  let error = rawError;
  if (rawError) {
    logger.error(rawError.constructor.name === "EnvVarError" ? rawError.message : rawError);
  }

  setTimeout(() => {
    //Waiting logger to flush all logs (MongoDB)
    close().catch((closeError) => {
      error = closeError;
      console.log(error);
    });
  }, 250);

  process.exitCode = error ? 1 : 0;
};

module.exports = async (job) => {
  let components = await createComponents();
  let timer = createTimer();
  timer.start();

  try {
    let results = await job(components);

    timer.stop(results);
    await exit(null, components.close);
  } catch (e) {
    await exit(e, components.close);
  }
};
