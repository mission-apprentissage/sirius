const env = require("env-var");
module.exports = {
  env: env.get("SIRIUS_ENV").default("dev").asString(),
  logType: env.get("SIRIUS_LOG_TYPE").default("console").asString(),
  logLevel: env.get("SIRIUS_LOG_LEVEL").default("info").asString(),
  mongodbUri: env.get("SIRIUS_MONGODB_URI").default("mongodb://127.0.0.1:27017/sirius").asString(),
};
