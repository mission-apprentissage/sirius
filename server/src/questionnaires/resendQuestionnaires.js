const moment = require("moment");
const { oleoduc, writeData } = require("oleoduc");
const { delay } = require("../core/utils/asyncUtils");

module.exports = async (db, logger, questionnaires, options = {}) => {
  let limit = options.limit || 1;
  let stats = {
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
    writeData(async ({ email, questionnaire }) => {
      try {
        if (stats.sent > limit || shouldBeIgnored(questionnaire)) {
          stats.ignored++;
        } else {
          let type = questionnaire.type;
          logger.info(`Resending questionnaire ${type} to ${email}...`);
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
