const { getNbModifiedDocuments } = require("../../core/mongoUtils");
const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };

  await oleoduc(
    db.collection("contrats").find(),
    transformObject((contrat) => {
      return {
        ...contrat.apprenti,
        creationDate: contrat.creationDate,
        cohorte: contrat.cohorte,
        unsubscribe: contrat.unsubscribe,
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
    writeObject(
      async (contrat) => {
        let results = await db.collection("contrats").replaceOne({ _id: contrat._id }, contrat);

        stats.updated += getNbModifiedDocuments(results);
      },
      { parallel: 2 }
    )
  );

  await db.collection("contrats").rename("apprentis");

  return stats;
};
