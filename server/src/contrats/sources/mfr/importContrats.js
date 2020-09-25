const parseCSV = require("./utils/parseCSV");
const { getNbModifiedDocuments } = require("../../../core/mongoUtils");

module.exports = async (db, logger, csvStream) => {
  return parseCSV(logger, csvStream, async (contrat) => {
    let results = await db.collection("contrats").insertOne(contrat);
    return getNbModifiedDocuments(results);
  });
};
