const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const createQuestionnaires = require("./questionnaires/questionnaires");
const logger = require("./core/logger");
const defaults = require("./config");

module.exports = async (options = {}) => {
  let client = options.client || (await connectToMongoDB());
  let config = options.config || defaults;
  let db = client.db();
  let mailer = createMailer(config);

  return {
    db,
    config,
    logger,
    mailer,
    close: () => client.close(),
    questionnaires: options.questionnaires || createQuestionnaires(db, mailer),
  };
};
