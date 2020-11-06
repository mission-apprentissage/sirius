const { getNbModifiedDocuments } = require("../../core/mongoUtils");

let update = async (db, ids, thematique) => {
  let selector = { $in: ids };
  let results = await db.collection("apprentis").updateMany(
    { "contrats.questionnaires.questions.id": selector },
    {
      $set: {
        "contrats.$[c].questionnaires.$[qt].questions.$[q].thematique": thematique,
      },
    },
    {
      arrayFilters: [
        {
          "c.questionnaires.questions.id": selector,
        },
        {
          "qt.questions.id": selector,
        },
        {
          "q.id": selector,
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
