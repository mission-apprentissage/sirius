// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const env = require("env-var");
const { oleoduc, writeObject, filterObject } = require("oleoduc");
const runScript = require("../runScript");

faker.locale = "fr";

runScript(async ({ db, mailer, logger }) => {
  const limit = env.get("LIMIT").default(0).asInt();
  let stats = {
    total: 0,
    sent: 0,
    failed: 0,
  };

  await oleoduc(
    db.collection("apprentis").find(),
    filterObject(() => stats.total <= limit),
    writeObject(
      async (apprenti) => {
        logger.info(`Sending email ${apprenti.email}`);
        stats.total++;

        try {
          await mailer.sendEmail(apprenti.email, apprenti.formation.intitule, "finAnnee", apprenti);
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
