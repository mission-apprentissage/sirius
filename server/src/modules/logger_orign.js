const bunyan = require("bunyan");
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

export default (config) => {
  let { log } = config;
  let { type, level } = log;

  let streams = [...(type === "console" ? [consoleStream(level)] : [jsonStream(level)])];

  return bunyan.createLogger({
    name: "sirius",
    serializers: bunyan.stdSerializers,
    streams,
  });
};
