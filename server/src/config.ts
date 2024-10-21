import env from "env-var";

const environement = env.get("ENV").required().asEnum(["local", "recette", "production", "test"]);

const config = {
  productName: env.get("PUBLIC_PRODUCT_NAME").required().asString(),
  port: env.get("SERVER_PORT").required().asPortNumber(),
  version: env.get("PUBLIC_VERSION").required().asString(),
  env: environement,
  publicUrl: env.get("SIRIUS_PUBLIC_URL").default("http://localhost:3000").asString(),
  log: {
    type: env.get("SIRIUS_LOG_TYPE").default("console").asString(),
    level: env.get("SIRIUS_LOG_LEVEL").default("info").asString(),
  },
  psql: {
    uri: env.get("PSQL_URI").required().asString(),
    ca: env.get("SIRIUS_PSQL_CA").default("").asString(),
    logLevel: env.get("SIRIUS_PILOTAGE_PSQL_LOG_LEVEL").default("info").asString(),
  },
  auth: {
    admin: env.get("SIRIUS_AUTH_ADMIN_PASSWORD").default("12345").asString(),
    jwtSecret: env.get("SIRIUS_AUTH_JWT_SECRET").default("abcdef").asString(),
    refreshTokenSecret: env.get("SIRIUS_AUTH_REFRESH_TOKEN_SECRET").default("abcdef").asString(),
    sessionExpiry: env.get("SIRIUS_AUTH_SESSION_EXPIRY").default(900).asInt(),
    refreshTokenExpiry: env.get("SIRIUS_AUTH_REFRESH_TOKEN_EXPIRY").default(2592000).asInt(),
    cookieSecret: env.get("SIRIUS_AUTH_COOKIE_SECRET").default("abcdef").asString(),
  },
  smtp: {
    host: env.get("SIRIUS_SMTP_HOST").default("localhost").asString(),
    port: env.get("SIRIUS_SMTP_PORT").default("1025").asString(),
    secure: env.get("SIRIUS_SMTP_SECURE").default("false").asBoolStrict(),
    auth: {
      user: env.get("SIRIUS_SMTP_AUTH_USER").asString(),
      pass: env.get("SIRIUS_SMTP_AUTH_PASS").asString(),
    },
    email_from: env.get("SIRIUS_EMAIL_FROM").default("sirius@test.fr").required().asString(),
  },
  slack: {
    token: env.get("SIRIUS_SLACK_TOKEN").default("").asString(),
    signingSecret: env.get("SIRIUS_SLACK_SIGNING_SECRET").default("").asString(),
    channel: env.get("SIRIUS_SLACK_CHANNEL").default("").asString(),
  },
  sentry: {
    dsn: env.get("SIRIUS_SENTRY_DSN").default("").asString(),
  },
};

export default config;
