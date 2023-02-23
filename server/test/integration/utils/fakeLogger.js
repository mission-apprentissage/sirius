const createLogger = require("../../../src/modules/logger");

module.exports = createLogger({
  env: "dev",
  log: {
    type: "console",
    level: process.env.SIRIUS_LOG_LEVEL || "fatal",
  },
});
