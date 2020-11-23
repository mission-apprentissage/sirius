const { getNbModifiedDocuments } = require("../../core/mongoUtils");

let update = async (db, ids, thematique) => {
  let results = await db.collection("apprentis").updateMany(
    {},
    {
      $set: {
        "contrats.$[].questionnaires.$[].questions.$[q].thematique": thematique,
      },
    },
    {
      arrayFilters: [
        {
          "q.id": { $in: ids },
        },
      ],
    }
  );
  return getNbModifiedDocuments(results);
};

module.exports = async (db) => {
  return {
    cfaRelationEntreprise: await update(db, ["suivi", "suiviPrecisions"], "cfaRelationEntreprise"),
    ambiance: await update(db, ["ambiance"], "ambiance"),
    formateurs: await update(db, ["formateurs"], "formateurs"),
    matériel: await update(db, ["ateliers"], "matériel"),
    preparationExamen: await update(db, ["coordination", "preparationExamen"], "preparationExamen"),
  };
};
