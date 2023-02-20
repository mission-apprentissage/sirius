const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const creatHttpClient = require("./core/httpClient");
const createCampagnes = require("./core/campagnes");
const createTemoignages = require("./core/temoignages");
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
    campagnesController: options.campagnes || createCampagnes(db),
    temoignagesController: options.temoignages || createTemoignages(db),
    close: () => client.close(),
  };
};
