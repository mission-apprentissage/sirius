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
          q.sendDates = [q.sentDate || new Date("2020-07-24T08:09:48.873Z")];
          delete q.sentDate;
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
