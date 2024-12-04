import * as Sentry from "@sentry/node";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { contentSecurityPolicy } from "helmet";
import passport from "passport";

import config from "./config";
import errorMiddleware from "./middlewares/errorMiddleware";
import { logMiddleware } from "./middlewares/logMiddleware";
import { jwtStrategy } from "./modules/authStrategies/jwtStrategy";
import { localStrategy } from "./modules/authStrategies/localStrategy";
import { campagnes } from "./routes/campagnes.routes";
import { etablissements } from "./routes/etablissements.routes";
import { formations } from "./routes/formations.routes";
import { jobs } from "./routes/jobs.routes";
import { questionnaires } from "./routes/questionnaires.routes";
import { temoignages } from "./routes/temoignages.routes";
import { users } from "./routes/users.routes";
import { verbatims } from "./routes/verbatims.routes";
import tryCatch from "./utils/tryCatch.utils";

export default async () => {
  const app = express();

  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  app.set("trust proxy", 1);
  app.use(contentSecurityPolicy());
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(
    cors({
      ...(config.env === "local"
        ? {
            origin: true,
            credentials: true,
          }
        : {}),
    })
  );
  app.use(cookieParser(config.auth.cookieSecret));
  app.use(logMiddleware());
  app.use(campagnes());
  app.use(temoignages());
  app.use(users());
  app.use(questionnaires());
  app.use(etablissements());
  app.use(formations());
  app.use(verbatims());
  app.use(jobs());
  app.use(passport.initialize());

  app.disable("x-powered-by");

  jwtStrategy();
  localStrategy();

  //Routes
  app.get(
    "/api/healthcheck",
    // @ts-expect-error
    tryCatch(async (_req, res) => {
      return res.json({
        name: config.productName,
        version: config.version,
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
