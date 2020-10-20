const bunyan = require("bunyan");
const { throttle } = require("lodash");
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
          text: util.format(`[SERVER][${env}] %O`, levelName.toUpperCase(), record),
        };
      },
    },
    (error) => {
      console.log("Unable to send log to slack", error);
    }
  );
  stream.write = throttle(stream.write, 5000);

  return {
    name: "slack",
    level: "error",
    stream: stream,
  };
};

const mongodbStream = (db, level) => {
  return {
    name: "mongodb",
    level,
    stream: writeObject((record) => db.collection("logs").insertOne(JSON.parse(record))),
  };
};

module.exports = (config, options = {}) => {
  let { env, slackWebhookUrl, log } = config;
  let { type, level } = log;
  let { db } = options;

  let streams = [
    ...(type === "console" ? [consoleStream(level)] : [jsonStream(level)]),
    ...(slackWebhookUrl ? [slackStream(env, slackWebhookUrl)] : []),
    ...(db ? [mongodbStream(db, level)] : []),
  ];

  return bunyan.createLogger({
    name: "sirius",
    serializers: bunyan.stdSerializers,
    streams,
  });
};
