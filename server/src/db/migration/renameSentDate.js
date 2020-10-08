const moment = require("moment");
const { getNbModifiedDocuments } = require("../../core/mongoUtils");
const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };

  await oleoduc(
    db.collection("apprentis").find(),
    transformObject((apprenti) => {
      apprenti.contrats = apprenti.contrats.map((c) => {
        c.questionnaires = c.questionnaires.map((q) => {
          let sendDate = q.sentDate;
          if (!sendDate || apprenti.cohorte === "cohorte_test_q2_2020_07_23") {
            sendDate = moment([2020, 6, 24, 18, 0]).toDate();
          } else if (apprenti.cohorte === "cohorte_test_q2_2020_08_28") {
            sendDate = moment([2020, 7, 28, 18, 0]).toDate();
          }

          if (q.nbEmailsSent > 1) {
            q.sendDates = [sendDate, moment(sendDate).add(7, "days").toDate()];
          } else {
            q.sendDates = [sendDate];
          }
          delete q.sentDate;
          delete q.nbEmailsSent;
          return q;
        });
        return c;
      });
      return apprenti;
    }),
    writeObject(async (apprenti) => {
      let results = await db.collection("apprentis").replaceOne({ _id: apprenti._id }, apprenti);
      stats.updated += getNbModifiedDocuments(results);
    })
  );

  return stats;
};
