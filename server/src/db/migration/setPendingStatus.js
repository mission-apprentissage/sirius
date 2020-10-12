const { getNbModifiedDocuments } = require("../../core/mongoUtils");

module.exports = async (db) => {
  let selector = { $elemMatch: { id: "diplome", "reponses.id": 2000 } };

  let results = await db.collection("apprentis").updateMany(
    { "contrats.questionnaires.questions": selector },
    {
      $set: {
        "contrats.$[c].questionnaires.$[q].status": "pending",
      },
    },
    {
      arrayFilters: [
        {
          "c.questionnaires.questions": selector,
        },
        {
          "q.questions": selector,
        },
      ],
    }
  );

  return {
    updated: getNbModifiedDocuments(results),
  };
};
