const env = require("env-var");
module.exports = {
  env: env.get("SIRIUS_ENV").default("standalone").asString(),
  publicUrl: env.get("SIRIUS_PUBLIC_URL").default("http://localhost:5000").asString(),
  slackWebhookUrl: env.get("SIRIUS_SLACK_WEBHOOK_URL").asString(),
  log: {
    type: env.get("SIRIUS_LOG_TYPE").default("console").asString(),
    level: env.get("SIRIUS_LOG_LEVEL").default("info").asString(),
  },
  mongodb: {
    uri: env.get("SIRIUS_MONGODB_URI").default("mongodb://127.0.0.1:27017/sirius").asString(),
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
  },
};
