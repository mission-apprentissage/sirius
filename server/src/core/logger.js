const bunyan = require("bunyan");
const util = require("util");
const { writeObject } = require("oleoduc");
const PrettyStream = require("bunyan-prettystream");
const BunyanSlack = require("bunyan-slack");

const jsonStream = (level) => {
  return {
    name: "json",
    level,
    stream: process.stdout,
  };
};

const consoleStream = (level) => {
  let pretty = new PrettyStream();
  pretty.pipe(process.stdout);
  return {
    name: "console",
    level,
    stream: pretty,
  };
};

const slackStream = (env, slackWebhookUrl) => {
  let stream = new BunyanSlack(
    {
      webhook_url: slackWebhookUrl,
      customFormatter: (record, levelName) => {
        if (record.type === "http") {
          record = {
            url: record.request.url.relative,
            statusCode: record.response.statusCode,
            ...(record.error ? { message: record.error.message } : {}),
          };
        }
        return {
          text: util.format(`[%s][${env}] %O`, levelName.toUpperCase(), record),
        };
      },
    },
    (error) => {
      console.log("Unable to send log to slack", error);
    }
  );

  return {
    name: "slack",
    level: "error",
    stream,
  };
};

module.exports = (env, conf, options = {}) => {
  let { type, level } = conf;
  let { db, slackWebhookUrl } = options;

  let streams = [type === "console" ? consoleStream(level) : jsonStream(level)];
  if (slackWebhookUrl) {
    streams.push(slackStream(env, slackWebhookUrl));
  }

  if (db) {
    streams.push({
      name: "mongodb",
      level,
      stream: writeObject((record) => {
        return db.collection("logs").insertOne(JSON.parse(record));
      }),
    });
  }

  return bunyan.createLogger({
    name: "sirius",
    serializers: bunyan.stdSerializers,
    streams,
  });
};
