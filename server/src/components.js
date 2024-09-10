const creatHttpClient = require("./modules/httpClient");
const createLogger = require("./modules/logger");
const defaults = require("./config");

module.exports = async (options = {}) => {
  let config = options.config || defaults;
  let logger = options.logger || createLogger(config);

  return {
    config,
    logger,
    httpClient: options.httpClient || creatHttpClient(logger),
  };
};
