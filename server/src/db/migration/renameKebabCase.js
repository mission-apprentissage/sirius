const { getNbModifiedDocuments } = require("../../core/mongoUtils");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };

  let results = await db.collection("contrats").updateMany(
    {},
    {
      $rename: {
        "formation.code_diplome": "formation.codeDiplome",
        "formation.annee_promotion": "formation.anneePromotion",
        "cfa.uai_responsable": "cfa.uaiResponsable",
        "cfa.uai_formateur": "cfa.uaiFormateur",
      },
    }
  );

  stats.updated += getNbModifiedDocuments(results);

  return stats;
};
