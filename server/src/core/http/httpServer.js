const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const logMiddleware = require("./logMiddleware");
const errorMiddleware = require("./errorMiddleware");
const tryCatch = require("./tryCatchMiddleware");
const campagnes = require("../../routes/campagnes.routes");
const temoignagesHttp = require("../../temoignages/temoignagesHttp");
const usersHttp = require("../../users/usersHttp");
const { version } = require("../../../package.json");

module.exports = async (components) => {
  const { db, config, logger } = components;

  const app = express();
  app.use(helmet.contentSecurityPolicy());
  app.use(bodyParser.json());
  app.use(cookieParser(config.auth.cookieSecret));
  app.use(logMiddleware(logger));
  app.use(campagnes(components));
  app.use(temoignagesHttp(components));
  app.use(usersHttp(components));
  app.use(passport.initialize());

  app.disable("x-powered-by");
  require("../auth/strategies/jwtStrategy");
  require("../auth/strategies/localStrategy");

  //Routes
  app.get(
    "/api/healthcheck",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await db
        .collection("apprentis")
        .stats()
        .then(() => {
          mongodbStatus = true;
        })
        .catch((e) => {
          mongodbStatus = false;
          logger.error("Healthcheck failed", e);
        });

      return res.json({
        version,
        env: config.env,
        healthcheck: mongodbStatus,
      });
    })
  );

  app.get(
    "/api/healthcheck/error",
    tryCatch(() => {
      throw new Error("Healthcheck error");
    })
  );

  app.use(errorMiddleware());

  return app;
};
