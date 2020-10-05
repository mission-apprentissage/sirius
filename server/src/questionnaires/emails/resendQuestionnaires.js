const { oleoduc, writeObject } = require("oleoduc");
const { delay } = require("../../core/asyncUtils");

module.exports = async (db, logger, questionnaires, options = {}) => {
  let limit = options.limit || 1;
  let stats = {
    total: 0,
    sent: 0,
    ignored: 0,
    failed: 0,
  };

  await oleoduc(
    db
      .collection("apprentis")
      .aggregate([
        { $match: { unsubscribe: false } },
        { $unwind: "$contrats" },
        { $unwind: "$contrats.questionnaires" },
        { $project: { email: "$email", questionnaire: "$contrats.questionnaires" } },
        { $match: { "questionnaire.status": { $ne: "closed" }, "questionnaire.sendDates.1": { $exists: false } } },
      ]),
    writeObject(
      async ({ email, questionnaire }) => {
        try {
          stats.total++;

          if (stats.sent <= limit) {
            logger.info(`Resending questionnaire ${questionnaire.type} to ${email}...`);
            await questionnaires.sendQuestionnaire(questionnaire.token);
            await delay(100);
            stats.sent++;
          } else {
            stats.ignored++;
          }
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
