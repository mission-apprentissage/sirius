const connectToMongoDB = require("./core/connectToMongoDB");
const createMailer = require("./core/mailer");
const creatHttpClient = require("./core/httpClient");
const campagnesDAO = require("./dao/campagnes.dao");
const temoignagesDAO = require("./dao/temoignages.dao.js");
const createLogger = require("./core/logger");
const usersDAO = require("./dao/users.dao");
const defaults = require("./config");
const Temoignage = require("./models/temoignage");
const Log = require("./models/log");
const Users = require("./models/user");

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
    temoignagesController: options.temoignages || temoignagesDAO(Temoignage),
    usersController: options.users || usersDAO(Users),
    close: () => client.connection.close(),
  };
};
