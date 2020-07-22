// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const env = require("env-var");
const { oleoduc, writeObject, filterObject } = require("oleoduc");
const runScript = require("../runScript");

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
    db.collection("apprentis").find({ "questionnaires.type": { $ne: type } }),
    filterObject(() => stats.total <= limit),
    writeObject(
      async (apprenti) => {
        try {
          stats.total++;
          logger.info(`Sending email ${type} to ${apprenti.email}`);
          await questionnaires.send(apprenti, type);

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
