const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const creatHttpClient = require("./core/httpClient");
const campagnesDAO = require("./dao/campagnes.dao");
const temoignagesDAO = require("./dao/temoignages.dao.js");
const createLogger = require("./core/logger");
const usersDAO = require("./dao/users.dao");
const defaults = require("./config");
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
    campagnes: options.campagnes || campagnesDAO,
    temoignages: options.temoignages || temoignagesDAO,
    users: options.users || usersDAO,
    close: () => client.connection.close(),
  };
};
