const createLogger = require("../../../src/core/logger");

module.exports = createLogger({
  type: "console",
  level: process.env.SIRIUS_LOG_LEVEL || "fatal",
});
