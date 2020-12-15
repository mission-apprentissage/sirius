const parseCSV = require("./parser/parseCSV");
const { getNbModifiedDocuments } = require("../core/utils/mongoUtils");

module.exports = async (db, logger, csvStream) => {
  let stats = {
    total: 0,
    updated: 0,
    invalid: 0,
  };

  let handleError = (err, json) => {
    stats.invalid++;

    let level = err.name === "ValidationError" ? "warn" : "error";
    logger[level](`Unable to update ${JSON.stringify(json, null, 2)}`, err);
  };

  let markApprentiAsUpdated = (email) => {
    stats.updated++;

    return db.collection("apprentis").updateOne(
      { email },
      {
        $set: {
          updateDate: new Date(),
        },
      }
    );
  };

  await parseCSV(csvStream, async (err, json) => {
    stats.total++;

    if (err) {
      handleError(err, json);
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
            prenom: apprenti.prenom,
            nom: apprenti.nom,
            "contrats.$.cfa": contrat.cfa,
            "contrats.$.entreprise": contrat.entreprise,
            "contrats.$.formation": contrat.formation,
          },
        }
      );

      let nbDocumentUpdated = getNbModifiedDocuments(results);
      if (nbDocumentUpdated > 0) {
        markApprentiAsUpdated(apprenti.email);
      }
    }
  });

  return stats;
};
