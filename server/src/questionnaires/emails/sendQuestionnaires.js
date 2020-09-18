const { oleoduc, writeObject } = require("oleoduc");
const { delay } = require("../../core/asyncUtils");

module.exports = async (db, logger, questionnaires, options = {}) => {
  let limit = options.limit || 1;
  let stats = {
    total: 0,
    sent: 0,
    failed: 0,
    ignored: 0,
  };

  await oleoduc(
    db.collection("contrats").find({ unsubscribe: false }),
    writeObject(async (contrat) => {
      try {
        let next = await questionnaires.generateNextQuestionnaire(contrat);

        stats.total++;
        if (stats.sent >= limit || !next || (options.type && next.type !== options.type)) {
          stats.ignored++;
        } else {
          logger.info(`Sending questionnaire ${next.type} with token ${next.token}`);
          await questionnaires.sendEmail(next.token);
          await delay(100);
          stats.sent++;
        }
      } catch (e) {
        logger.error(e);
        stats.failed++;
      }
    })
  );

  return stats;
};
