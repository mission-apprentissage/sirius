const { oleoduc, writeObject } = require("oleoduc");
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
    db.collection("contrats").find({ unsubscribe: false, "questionnaires.nbEmailsSent": { $lt: 2 } }),
    writeObject(
      async (contrat) => {
        try {
          let results = contrat.questionnaires.filter(({ status }) => status && status !== "closed");
          if (results.length > 0 && ++stats.total <= limit) {
            logger.info(`Resending questionnaire ${type} to ${contrat.apprenti.email}`);
            await Promise.all(results.map((q) => questionnaires.sendEmail(q.token)));
            await delay(100);
            stats.sent += results.length;
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
