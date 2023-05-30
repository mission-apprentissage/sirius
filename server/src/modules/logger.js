const bunyan = require("bunyan");
const { writeData } = require("oleoduc");
const PrettyStream = require("bunyan-prettystream");

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

const mongodbStream = (Log, level) => {
  return {
    name: "mongodb",
    level,
    stream: writeData((record) => Log.create(JSON.parse(record))),
  };
};

module.exports = (config, options = {}) => {
  let { log } = config;
  let { type, level } = log;
  let { Log } = options;

  let streams = [
    ...(type === "console" ? [consoleStream(level)] : [jsonStream(level)]),
    ...(Log ? [mongodbStream(Log, level)] : []),
  ];

  return bunyan.createLogger({
    name: "sirius",
    serializers: bunyan.stdSerializers,
    streams,
  });
};
