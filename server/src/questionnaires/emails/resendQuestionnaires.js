const moment = require("moment");
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
  let shouldBeIgnored = (questionnaire) => {
    let diplome = questionnaire.questions.find((q) => q.id === "diplome");
    if (diplome && questionnaire.status === "pending") {
      return moment().diff(moment(questionnaire.sendDates[0]), "days") < 30;
    }
    return false;
  };

  await oleoduc(
    db.collection("apprentis").aggregate([
      { $match: { unsubscribe: false } },
      { $unwind: "$contrats" },
      { $unwind: "$contrats.questionnaires" },
      {
        $match: {
          "contrats.questionnaires.status": { $ne: "closed" },
          "contrats.questionnaires.sendDates.0": { $lte: moment().subtract(6, "days").toDate() },
          "contrats.questionnaires.sendDates.1": { $exists: false },
        },
      },
      { $project: { email: "$email", questionnaire: "$contrats.questionnaires" } },
    ]),
    writeObject(async ({ email, questionnaire }) => {
      try {
        stats.total++;
        if (stats.sent > limit || shouldBeIgnored(questionnaire)) {
          stats.ignored++;
        } else {
          logger.info(`Resending questionnaire ${questionnaire.type} to ${email}...`);
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
