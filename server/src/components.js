const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const creatHttpClient = require("./core/httpClient");
const createQuestionnaires = require("./core/questionnaires");
const createWorkflow = require("./core/workflow");
const createApprentis = require("./core/apprentis");
const createEntreprises = require("./core/entreprises");
const createCampagnes = require("./core/campagnes");
const createLogger = require("./core/logger");
const defaults = require("./config");

module.exports = async (options = {}) => {
  let config = options.config || defaults;
  let client = options.client || (await connectToMongoDB(config.mongodb));
  let db = client.db();
  let mailer = options.mailer || createMailer(config);
  let logger = options.logger || createLogger(config, { db });

  return {
    db,
    config,
    logger,
    mailer,
    httpClient: options.httpClient || creatHttpClient(logger),
    workflow: options.workflow || createWorkflow(db),
    questionnaires: options.questionnaires || createQuestionnaires(db, mailer),
    apprentis: options.apprentis || createApprentis(db),
    entreprises: options.entreprises || createEntreprises(db),
    campagnesController: options.campagnes || createCampagnes(db),
    close: () => client.close(),
  };
};
