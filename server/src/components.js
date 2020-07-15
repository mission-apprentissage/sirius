const connectToMongoDB = require("./common/connectToMongoDB");
const mailer = require("./common/emails/mailer");
const logger = require("./common/logger");
const defaults = require("./config");

module.exports = async (options = {}) => {
  let client = await connectToMongoDB();

  let config = options.config || defaults;
  return {
    db: options.db || client.db(),
    config,
    logger,
    mailer: mailer(config),
    close: () => client.close(),
  };
};
