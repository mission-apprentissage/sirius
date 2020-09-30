const { getNbModifiedDocuments } = require("../../core/mongoUtils");
const { oleoduc, transformObject, writeObject } = require("oleoduc");
const createIndexes = require("../indexes/createIndexes");
const dropIndexes = require("../indexes/dropIndexes");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };

  await dropIndexes(db);
  await oleoduc(
    db.collection("contrats").find(),
    transformObject((contrat) => {
      return {
        _id: contrat._id,
        creationDate: contrat.creationDate,
        cohorte: contrat.cohorte,
        unsubscribe: contrat.unsubscribe,
        ...contrat.apprenti,
        contrats: [
          {
            questionnaires: contrat.questionnaires,
            formation: contrat.formation,
            cfa: contrat.cfa,
            rupture: contrat.rupture,
            entreprise: contrat.entreprise,
          },
        ],
      };
    }),
    writeObject(async (apprenti) => {
      let results = await db.collection("contrats").replaceOne({ _id: apprenti._id }, apprenti);
      stats.updated += getNbModifiedDocuments(results);
    })
  );

  await db.collection("contrats").rename("apprentis");
  await createIndexes(db);

  return stats;
};
