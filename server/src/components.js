const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const createQuestionnaires = require("./questionnaires/questionnaires");
const createContrats = require("./contrats/contrats");
const createLogger = require("./core/logger");
const defaults = require("./config");

module.exports = async (options = {}) => {
  let config = options.config || defaults;
  let client = options.client || (await connectToMongoDB(config.mongodb));
  let db = client.db();
  let logger = options.logger || createLogger(config.env, config.log, { db, slackWebhookUrl: config.slackWebhookUrl });
  let mailer = createMailer(config);
  let contrats = options.contrats || createContrats(db, mailer);

  return {
    db,
    config,
    logger,
    mailer,
    close: () => client.close(),
    contrats,
    questionnaires: options.questionnaires || createQuestionnaires(db, mailer, contrats),
  };
};
