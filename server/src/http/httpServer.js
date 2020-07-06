const express = require("express");
const bodyParser = require("body-parser");
const Joi = require("@hapi/joi");
const Boom = require("boom");
const logger = require("../common/logger");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./middlewares/tryCatchMiddleware");
const packageJson = require("../../package.json");

module.exports = async (components) => {
  const { db, config } = components;
  const app = express();

  app.use(bodyParser.json());
  app.use(logMiddleware());

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
        version: packageJson.version,
        env: config.env,
        healthcheck: {
          mongodb: mongodbStatus,
        },
      });
    })
  );

  app.get(
    "/api/questionnaire",
    tryCatch(async (req, res) => {
      let { token } = await Joi.object({
        token: Joi.string().required(),
      }).validateAsync(req.query, { abortEarly: false });

      let apprenti = await db.collection("apprentis").findOne({ token });

      if (!apprenti) {
        throw Boom.badRequest("Token invalide");
      }

      res.json({
        prenom: apprenti.prenom,
      });
    })
  );

  app.use(errorMiddleware());

  return app;
};
