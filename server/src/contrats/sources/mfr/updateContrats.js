const parseCSV = require("./utils/parseCSV");
const { getNbModifiedDocuments } = require("../../../core/mongoUtils");

module.exports = async (db, logger, csvStream) => {
  let stats = {
    total: 0,
    updated: 0,
    failed: 0,
  };

  await parseCSV(csvStream, async (err, contrat) => {
    stats.total++;
    if (err) {
      logger.error(`Unable to handle ${JSON.stringify(contrat, null, 2)}`, err);
      stats.failed++;
    } else {
      let results = await db.collection("contrats").updateOne(
        { "apprenti.email": contrat.apprenti.email },
        {
          $set: {
            "cfa.nom": contrat.cfa.nom,
            "cfa.siret": contrat.cfa.siret,
            "cfa.codePostal": contrat.cfa.codePostal,
          },
        }
      );
      stats.updated += getNbModifiedDocuments(results);
    }
  });

  return stats;
};
