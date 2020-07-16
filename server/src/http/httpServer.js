const express = require("express");
const bodyParser = require("body-parser");
const logger = require("../common/logger");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const emailsRouter = require("./routers/emailsRouter");
const questionnnairesRouter = require("./routers/questionnnairesRouter");
const { version } = require("../../package.json");

module.exports = async (components) => {
  const { db, config } = components;
  const app = express();

  app.use(bodyParser.json());
  app.use(logMiddleware());
  app.use(emailsRouter(components));
  app.use(questionnnairesRouter(components));

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
