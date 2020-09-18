const { oleoduc, writeObject } = require("oleoduc");
const { delay } = require("../../core/asyncUtils");

module.exports = async (db, logger, questionnaires, options = {}) => {
  let limit = options.limit || 1;
  let stats = {
    total: 0,
    sent: 0,
    failed: 0,
  };

  await oleoduc(
    db.collection("contrats").find({ unsubscribe: false }),
    writeObject(
      async (contrat) => {
        try {
          let results = contrat.questionnaires.filter((q) => q.status && q.status !== "closed" && q.nbEmailsSent < 2);
          stats.total += results.length;

          if (results.length > 0 && stats.sent <= limit) {
            await Promise.all(
              results.map((q) => {
                logger.info(`Resending questionnaire ${q.type} to ${contrat.apprenti.email}`);
                return questionnaires.sendEmail(q.token);
              })
            );
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
