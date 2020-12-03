const parseCSV = require("./parser/parseCSV");

const { getNbModifiedDocuments } = require("../core/utils/mongoUtils");

module.exports = async (db, logger, csvStream) => {
  let stats = {
    total: 0,
    updated: 0,
    failed: 0,
  };

  await parseCSV(csvStream, async (err, json) => {
    stats.total++;
    if (err) {
      logger.error(`Unable to handle ${JSON.stringify(json, null, 2)}`, err);
      stats.failed++;
    } else {
      let { apprenti, contrat } = json;
      let results = await db.collection("apprentis").updateOne(
        {
          email: apprenti.email,
          "contrats.formation.codeDiplome": contrat.formation.codeDiplome,
          "contrats.cfa.siret": contrat.cfa.siret,
          "contrats.entreprise.siret": contrat.entreprise.siret,
        },
        {
          $set: {
            "contrats.$.cfa": contrat.cfa,
            "contrats.$.entreprise": contrat.entreprise,
            "contrats.$.formation": contrat.formation,
          },
        }
      );
      stats.updated += getNbModifiedDocuments(results);
    }
  });

  return stats;
};
