const bunyan = require("bunyan");
const PrettyStream = require("bunyan-prettystream");
const config = require("../config");

let createStreams = () => {
  const jsonStream = () => {
    return {
      name: "json",
      level: config.logLevel,
      stream: process.stdout,
    };
  };

  const consoleStream = () => {
    let pretty = new PrettyStream();
    pretty.pipe(process.stdout);
    return {
      name: "console",
      level: config.logLevel,
      stream: pretty,
    };
  };

  return [config.logType === "console" ? consoleStream() : jsonStream()];
};

module.exports = bunyan.createLogger({
  name: "sirius",
  serializers: bunyan.stdSerializers,
  streams: createStreams(),
});
