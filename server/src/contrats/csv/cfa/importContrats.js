const readContratsCSV = require("./utils/readContratsCSV");
const validateContrat = require("./utils/validateContrat");
const { getNbModifiedDocuments } = require("../../../core/mongoUtils");

module.exports = async (db, logger, csvStream) => {
  return readContratsCSV(logger, csvStream, async (contrat) => {
    await validateContrat(contrat);
    let results = await db.collection("contrats").insertOne(contrat);
    return getNbModifiedDocuments(results);
  });
};
