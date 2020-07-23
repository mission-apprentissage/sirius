const env = require("env-var");
const { createReadStream } = require("fs");
const runScript = require("../../../core/runScript");
const importContrats = require("./importContrats");

runScript(async ({ db, logger }) => {
  const file = env.get("FILE").default(0).asString();
  let inputStream = createReadStream(file);

  return importContrats(db, logger, inputStream);
});
