const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./utils/tryCatch.utils");
const campagnes = require("./routes/campagnes.routes");
const temoignages = require("./routes/temoignages.routes");
const users = require("./routes/users.routes");
const questionnaires = require("./routes/questionnaires.routes");
const etablissements = require("./routes/etablissements.routes");
const formations = require("./routes/formations.routes");

const { version } = require("../package.json");

module.exports = async (components) => {
  const { db, config, logger } = components;

  const app = express();
  app.use(helmet.contentSecurityPolicy());
  app.use(bodyParser.json());
  app.use(cookieParser(config.auth.cookieSecret));
  app.use(logMiddleware(logger));
  app.use(campagnes());
  app.use(temoignages());
  app.use(users());
  app.use(questionnaires());
  app.use(etablissements());
  app.use(formations());
  app.use(passport.initialize());

  app.disable("x-powered-by");
  require("./modules/authStrategies/jwtStrategy");
  require("./modules/authStrategies/localStrategy");

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
