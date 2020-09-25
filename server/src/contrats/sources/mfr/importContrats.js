const moment = require("moment");
const parseCSV = require("./utils/parseCSV");
const { getNbModifiedDocuments } = require("../../../core/mongoUtils");

module.exports = async (db, logger, csvStream) => {
  return parseCSV(logger, csvStream, async (contrat) => {
    let results = await db.collection("contrats").insertOne({
      creationDate: new Date(),
      cohorte: `cohorte_test_q2_${moment().format("YYYY_MM_DD")}`,
      questionnaires: [],
      unsubscribe: false,
      ...contrat,
    });
    return getNbModifiedDocuments(results);
  });
};
