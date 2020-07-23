const createLogger = require("../../../src/core/logger");

module.exports = createLogger("test", {
  type: "console",
  level: process.env.SIRIUS_LOG_LEVEL || "fatal",
});
