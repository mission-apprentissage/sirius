const express = require("express");
const bodyParser = require("body-parser");
const logMiddleware = require("./logMiddleware");
const errorMiddleware = require("./errorMiddleware");
const tryCatch = require("./tryCatchMiddleware");
const questionnairesHttp = require("../../questionnaires/questionnairesHttp");
const contratsHttp = require("../../contrats/contratsHttp");
const { version } = require("../../../package.json");

module.exports = async (components) => {
  const { db, config, logger } = components;

  const app = express();

  app.use(bodyParser.json());
  app.use(logMiddleware(logger));
  app.use(questionnairesHttp(components));
  app.use(contratsHttp(components));

  //Routes
  app.get(
    "/api",
    tryCatch(async (req, res) => {
      let mongodbStatus;
      await db
        .collection("questionnaires")
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
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  app.use(errorMiddleware());

  return app;
};
