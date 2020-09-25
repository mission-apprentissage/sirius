const parseCSV = require("./utils/parseCSV");
const { getNbModifiedDocuments } = require("../../../core/mongoUtils");

module.exports = async (db, logger, csvStream) => {
  return parseCSV(logger, csvStream, async (contrat) => {
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
    return getNbModifiedDocuments(results);
  });
};
