const createLogger = require("../../../src/core/logger");
const defaults = require("../../../src/config");

module.exports = createLogger({
  env: "dev",
  log: {
    type: "console",
    level: defaults.log.level || "fatal",
  },
});
