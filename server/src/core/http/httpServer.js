const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const rewriteDeprecatedUrlMiddleware = require("./rewriteDeprecatedUrlMiddleware");
const logMiddleware = require("./logMiddleware");
const errorMiddleware = require("./errorMiddleware");
const tryCatch = require("./tryCatchMiddleware");
const questionnairesHttp = require("../../questionnaires/questionnairesHttp");
const contratsHttp = require("../../apprentis/apprentisHttp");
const { version } = require("../../../package.json");

module.exports = async (components) => {
  const { db, config, logger } = components;

  const app = express();

  app.use(helmet.contentSecurityPolicy());
  app.use(bodyParser.json());
  app.use(logMiddleware(logger));
  app.use(rewriteDeprecatedUrlMiddleware());
  app.use(questionnairesHttp(components));
  app.use(contratsHttp(components));
  app.disable("x-powered-by");

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
