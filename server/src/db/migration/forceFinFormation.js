const { getNbModifiedDocuments } = require("../../core/mongoUtils");
const { oleoduc, writeObject } = require("oleoduc");

module.exports = async (db, questionnaires) => {
  let stats = {
    updated: 0,
    ignored: 0,
  };

  await oleoduc(
    db.collection("contrats").find({ "formation.periode.fin": { $lte: new Date() } }),
    writeObject(
      async (contrat) => {
        let next = await questionnaires.generateNextQuestionnaire(contrat);
        if (next) {
          let results = await db.collection("contrats").updateOne(
            { "questionnaires.token": next.token },
            {
              $set: {
                "questionnaires.$.status": "error",
                "questionnaires.$.nbEmailsSent": 2,
              },
            }
          );
          stats.updated += getNbModifiedDocuments(results);
        } else {
          stats.ignored++;
        }
      },
      { parallel: 2 }
    )
  );

  return stats;
};
