const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const creatHttpClient = require("./core/httpClient");
const createQuestionnaires = require("./questionnaires/questionnaires");
const createApprentis = require("./core/apprentis");
const createLogger = require("./core/logger");
const defaults = require("./config");

module.exports = async (options = {}) => {
  let config = options.config || defaults;
  let client = options.client || (await connectToMongoDB(config.mongodb));
  let db = client.db();
  let mailer = options.mailer || createMailer(config);
  let logger = options.logger || createLogger(config, { db });
  let apprentis = options.apprentis || createApprentis(db);
  let questionnaires = options.questionnaires || createQuestionnaires(db, mailer, apprentis);
  let httpClient = options.httpClient || creatHttpClient(logger);

  return {
    db,
    config,
    logger,
    mailer,
    httpClient,
    questionnaires,
    apprentis,
    close: () => client.close(),
  };
};
