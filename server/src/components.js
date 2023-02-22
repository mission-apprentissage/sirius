const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const creatHttpClient = require("./core/httpClient");
const createCampagnes = require("./core/campagnes");
const createTemoignages = require("./core/temoignages");
const createLogger = require("./core/logger");
const defaults = require("./config");
const Campagne = require("./models/campagne");
const Temoignage = require("./models/temoignage");
const Log = require("./models/log");

module.exports = async (options = {}) => {
  let config = options.config || defaults;
  let client = options.client || (await connectToMongoDB(config.mongodb));
  let mailer = options.mailer || createMailer(config);
  let logger = options.logger || createLogger(config, { Log });

  return {
    config,
    logger,
    mailer,
    httpClient: options.httpClient || creatHttpClient(logger),
    campagnesController: options.campagnes || createCampagnes(Campagne),
    temoignagesController: options.temoignages || createTemoignages(Temoignage),
    close: () => client.close(),
  };
};
