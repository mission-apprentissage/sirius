const bunyan = require("bunyan");
const PrettyStream = require("bunyan-prettystream");
const config = require("../config");

let createStreams = () => {
  const jsonStream = () => {
    return {
      name: "json",
      level: config.log.level,
      stream: process.stdout,
    };
  };

  const consoleStream = () => {
    let pretty = new PrettyStream();
    pretty.pipe(process.stdout);
    return {
      name: "console",
      level: config.log.level,
      stream: pretty,
    };
  };

  return [config.log.type === "console" ? consoleStream() : jsonStream()];
};

module.exports = bunyan.createLogger({
  name: "sirius",
  serializers: bunyan.stdSerializers,
  streams: createStreams(),
});
