const { oleoduc, writeObject } = require("oleoduc");
const { delay } = require("../../core/asyncUtils");

module.exports = async (db, logger, apprentis, questionnaires, options = {}) => {
  let limit = options.limit || 1;
  let stats = {
    total: 0,
    sent: 0,
    failed: 0,
    ignored: 0,
  };

  await oleoduc(
    db.collection("apprentis").find({ unsubscribe: false }),
    writeObject(async (apprenti) => {
      try {
        let email = apprenti.email;
        let next = await apprentis.whatsNext(email);
        stats.total++;

        if (stats.sent >= limit || !next || (options.type && next.questionnaire.type !== options.type)) {
          stats.ignored++;
        } else {
          let { contrat, questionnaire } = next;

          await apprentis.addQuestionnaire(email, contrat, questionnaire);

          logger.info(`Sending questionnaire ${questionnaire.type} with token ${questionnaire.token}`);
          await questionnaires.sendQuestionnaire(questionnaire.token);

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
