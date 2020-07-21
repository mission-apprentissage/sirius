// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const env = require("env-var");
const uuid = require("uuid");
const { oleoduc, writeObject, filterObject } = require("oleoduc");
const runScript = require("../runScript");

faker.locale = "fr";

runScript(async ({ db, mailer, logger }) => {
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
          let token = uuid.v4();

          await db.collection("apprentis").updateOne(
            { _id: apprenti._id },
            {
              $push: {
                questionnaires: {
                  type,
                  token,
                  status: "send",
                  reponses: [],
                },
              },
            }
          );

          logger.info(`Sending email ${type} to ${apprenti.email}/${token}`);
          await mailer.sendEmail(apprenti.email, apprenti.formation.intitule, type, { apprenti, token });
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
