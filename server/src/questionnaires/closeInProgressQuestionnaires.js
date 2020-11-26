const moment = require("moment");
const { getNbModifiedDocuments } = require("../core/mongoUtils");

module.exports = async (db) => {
  let results = await db.collection("apprentis").updateMany(
    {},
    {
      $set: {
        "contrats.$[].questionnaires.$[q].status": "closed",
        "contrats.$[].questionnaires.$[q].updateDate": new Date(),
      },
    },
    {
      arrayFilters: [
        {
          "q.status": "inprogress",
          "q.updateDate": { $lte: moment().subtract(1, "months").toDate() },
        },
      ],
    }
  );

  return { updated: getNbModifiedDocuments(results) };
};
