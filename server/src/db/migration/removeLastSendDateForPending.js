const { getNbModifiedDocuments } = require("../../core/mongoUtils");

module.exports = async (db) => {
  let results = await db.collection("apprentis").updateMany(
    {},
    {
      $pop: { "contrats.$[].questionnaires.$[q].sendDates": 1 },
    },
    {
      arrayFilters: [
        {
          "q.status": "pending",
          "q.sendDates.1": { $exists: true },
        },
      ],
    }
  );

  return {
    updated: getNbModifiedDocuments(results),
  };
};
