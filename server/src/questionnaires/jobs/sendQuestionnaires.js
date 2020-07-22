// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const env = require("env-var");
const { oleoduc, writeObject, filterObject } = require("oleoduc");
const runScript = require("../../core/runScript");
const { delay } = require("../../core/asyncUtils");

faker.locale = "fr";

runScript(async ({ db, logger, questionnaires }) => {
  const limit = env.get("LIMIT").default(0).asInt();
  let type = "finAnnee";
  let stats = {
    total: 0,
    sent: 0,
    failed: 0,
  };

  await oleoduc(
    db.collection("contrats").find({ "questionnaires.type": { $ne: type } }),
    filterObject(() => {
      return ++stats.total <= limit;
    }),
    writeObject(
      async (contrat) => {
        try {
          logger.info(`Sending questionnaire ${type} to ${contrat.apprenti.email}`);
          await delay(100);
          await questionnaires.send(type, contrat);

          stats.sent++;
        } catch (e) {
          logger.error(e);
          stats.failed++;
        }
      },
      { parallel: 2 }
    )
  );

  return stats;
});
