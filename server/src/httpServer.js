const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");
const logMiddleware = require("./middlewares/logMiddleware");
const errorMiddleware = require("./middlewares/errorMiddleware");
const tryCatch = require("./utils/tryCatch.utils");
const campagnes = require("./routes/campagnes.routes");
const temoignages = require("./routes/temoignages.routes");
const users = require("./routes/users.routes");
const questionnaires = require("./routes/questionnaires.routes");
const etablissements = require("./routes/etablissements.routes");
const formations = require("./routes/formations.routes");
const verbatims = require("./routes/verbatims.routes");
const { version } = require("../package.json");

module.exports = async (components) => {
  const { config, logger } = components;

  const app = express();

  Sentry.init({
    dsn: config.sentry.dsn,
    integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
    enabled: config.env !== "dev",
    tracesSampleRate: config.env === "production" ? 0.3 : 1.0,
    tracePropagationTargets: [/^https:\/\/[^/]*\.inserjeunes\.beta\.gouv\.fr/],
    environment: config.env,
  });

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  app.set("trust proxy", 1);
  app.use(helmet.contentSecurityPolicy());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(cookieParser(config.auth.cookieSecret));
  app.use(logMiddleware(logger));
  app.use(campagnes());
  app.use(temoignages());
  app.use(users());
  app.use(questionnaires());
  app.use(etablissements());
  app.use(formations());
  app.use(verbatims());
  app.use(passport.initialize());

  app.disable("x-powered-by");
  require("./modules/authStrategies/jwtStrategy");
  require("./modules/authStrategies/localStrategy");

  //Routes
  app.get(
    "/api/healthcheck",
    tryCatch(async (req, res) => {
      return res.json({
        version,
        env: config.env,
      });
    })
  );

  app.get(
    "/api/healthcheck/error",
    tryCatch(() => {
      throw new Error("Healthcheck error");
    })
  );

  app.use(Sentry.Handlers.errorHandler());

  app.use(errorMiddleware());

  return app;
};
