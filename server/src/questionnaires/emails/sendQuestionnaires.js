const { oleoduc, writeObject, filterObject } = require("oleoduc");
const { delay } = require("../../core/asyncUtils");

module.exports = async (db, logger, questionnaires, options = {}) => {
  let type = "finAnnee";
  let limit = options.limit || 1;
  let stats = {
    total: 0,
    sent: 0,
    failed: 0,
  };

  await oleoduc(
    db.collection("contrats").find({ "questionnaires.type": { $ne: type }, unsubscribe: false }),
    filterObject(() => ++stats.total <= limit),
    writeObject(
      async (contrat) => {
        try {
          logger.info(`Sending questionnaire ${type} to ${contrat.apprenti.email}`);
          let token = await questionnaires.create(type, contrat);

          await delay(100);
          await questionnaires.sendEmail(token);

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
};
