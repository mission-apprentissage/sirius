import env from "env-var";

const environement = env.get("ENV").required().asEnum(["local", "recette", "production", "test"]);

const config = {
  productName: env.get("PUBLIC_PRODUCT_NAME").required().asString(),
  port: env.get("SERVER_PORT").required().asPortNumber(),
  version: env.get("PUBLIC_VERSION").required().asString(),
  env: environement,
  publicUrl: env.get("PUBLIC_URL").required().asString(),
  log: {
    type: env.get("LOG_TYPE").required().asString(),
    level: env.get("LOG_LEVEL").required().asString(),
  },
  psql: {
    uri: env.get("PSQL_URI").required().asString(),
    ca: env
      .get("PSQL_CA")
      .required(environement === "production")
      .asString(),
    logLevel: env
      .get("PSQL_LOG_LEVEL")
      .required(environement === "production")
      .asString(),
  },
  auth: {
    jwtSecret: env.get("AUTH_JWT_SECRET").required().asString(),
    refreshTokenSecret: env.get("AUTH_REFRESH_TOKEN_SECRET").required().asString(),
    sessionExpiry: env.get("AUTH_SESSION_EXPIRY").required().asInt(),
    refreshTokenExpiry: env.get("AUTH_REFRESH_TOKEN_EXPIRY").required().asInt(),
    cookieSecret: env.get("AUTH_COOKIE_SECRET").required().asString(),
  },
  smtp: {
    host: env.get("SMTP_HOST").required().asString(),
    port: env.get("SMTP_PORT").required().asString(),
    auth: {
      user: env.get("SMTP_AUTH_USER").asString(),
      pass: env.get("SMTP_AUTH_PASS").asString(),
    },
    email_from: env.get("EMAIL_FROM").required().asString(),
  },
  slack: {
    token: env
      .get("SLACK_TOKEN")
      .required(environement === "production")
      .asString(),
    signingSecret: env
      .get("SLACK_SIGNING_SECRET")
      .required(environement === "production")
      .asString(),
    channel: env
      .get("SLACK_CHANNEL")
      .required(environement !== "local" && environement !== "test")
      .asString(),
  },
  sentry: {
    dsn: env.get("SENTRY_DSN").required().asString(),
  },
};

export default config;
