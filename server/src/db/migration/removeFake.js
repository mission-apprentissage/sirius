const { getNbModifiedDocuments } = require("../../core/mongoUtils");

module.exports = async (db) => {
  let results = await db.collection("contrats").removeMany({ cohorte: "cohorte_test_fake" });

  return {
    removed: getNbModifiedDocuments(results),
  };
};
