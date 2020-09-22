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
        let next = questionnaires.findNext(contrat);
        stats.total++;

        if (stats.sent >= limit || !next || (options.type && next !== options.type)) {
          stats.ignored++;
        } else {
          let newQuestionnaire = await questionnaires.create(contrat, next);
          logger.info(`Sending questionnaire ${newQuestionnaire.type} with token ${newQuestionnaire.token}`);
          await questionnaires.sendQuestionnaire(newQuestionnaire.token);
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
