const env = require("env-var");
const runScript = require("../../../core/runScript");
const sendQuestionnaires = require("./sendQuestionnaires");

runScript(async ({ db, logger, questionnaires }) => {
  const limit = env.get("LIMIT").default(0).asInt();

  return sendQuestionnaires(db, logger, questionnaires, { limit });
});
