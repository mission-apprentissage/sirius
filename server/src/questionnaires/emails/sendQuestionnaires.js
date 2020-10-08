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
        let context = await apprentis.getNextQuestionnaireContext(email);
        stats.total++;

        if (stats.sent >= limit || !context || (options.type && context.type !== options.type)) {
          stats.ignored++;
        } else {
          let nextQuestionnaire = await apprentis.generateQuestionnaire(email, context);
          logger.info(`Sending questionnaire ${nextQuestionnaire.type} with token ${nextQuestionnaire.token}`);
          await questionnaires.sendQuestionnaire(nextQuestionnaire.token);
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
