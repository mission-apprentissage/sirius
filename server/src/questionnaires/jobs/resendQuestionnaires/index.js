const env = require("env-var");
const runScript = require("../../../core/runScript");
const resendQuestionnaires = require("./resendQuestionnaires");

runScript(async ({ db, logger, questionnaires }) => {
  const limit = env.get("LIMIT").default(0).asInt();

  return resendQuestionnaires(db, logger, questionnaires, { limit });
});
