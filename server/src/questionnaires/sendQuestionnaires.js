const { oleoduc, writeData } = require("oleoduc");
const { delay } = require("../core/utils/asyncUtils");

module.exports = async (db, logger, workflow, apprentis, questionnaires, options = {}) => {
  let limit = options.limit || 1;
  let stats = {
    sent: 0,
    failed: 0,
    ignored: 0,
  };

  await oleoduc(
    db.collection("apprentis").find(),
    writeData(async (apprenti) => {
      try {
        let email = apprenti.email;
        let next = await workflow.whatsNext(email);

        if (stats.sent >= limit || !next || (options.type && next.type !== options.type)) {
          stats.ignored++;
        } else {
          let { contrat, type } = next;
          let questionnaire = questionnaires.buildQuestionnaire(contrat, type);

          await apprentis.addQuestionnaire(email, contrat, questionnaire);

          logger.info(`Sending questionnaire ${questionnaire.type} with token ${questionnaire.token}`);
          await questionnaires.sendQuestionnaire(questionnaire.token);

          await delay(100);
          stats[type] = (stats[type] || 0) + 1;
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
