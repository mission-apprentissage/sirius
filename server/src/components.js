const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const createQuestionnaires = require("./questionnaires/questionnaires");
const createContrats = require("./contrats/contrats");
const logger = require("./core/logger");
const defaults = require("./config");

module.exports = async (options = {}) => {
  let client = options.client || (await connectToMongoDB());
  let config = options.config || defaults;
  let db = client.db();
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
