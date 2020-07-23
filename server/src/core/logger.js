const bunyan = require("bunyan");
const PrettyStream = require("bunyan-prettystream");

let createStreams = (conf) => {
  const jsonStream = () => {
    return {
      name: "json",
      level: conf.level,
      stream: process.stdout,
    };
  };

  const consoleStream = () => {
    let pretty = new PrettyStream();
    pretty.pipe(process.stdout);
    return {
      name: "console",
      level: conf.level,
      stream: pretty,
    };
  };

  return [conf.type === "console" ? consoleStream() : jsonStream()];
};

module.exports = (conf) =>
  bunyan.createLogger({
    name: "sirius",
    serializers: bunyan.stdSerializers,
    streams: createStreams(conf),
  });
