const { oleoduc, transformObject } = require("oleoduc");

module.exports = (db) => {
  let stream = db.collection("contrats").aggregate([
    { $match: { "questionnaires.status": "closed" } },
    { $unwind: "$questionnaires" },
    { $unwind: "$questionnaires.reponses" },
    { $unwind: { path: "$questionnaires.reponses.data.value", includeArrayIndex: "labelIndex" } },
    { $match: { "questionnaires.reponses.data.value": { $type: "number" } } },
    {
      $group: {
        _id: {
          cfa: "$cfa.siret",
          reponse: "$questionnaires.reponses.id",
          value: "$questionnaires.reponses.data.value",
        },
        cfa: { $first: "$cfa" },
        reponse: { $first: "$questionnaires.reponses.id" },
        label: { $first: "$questionnaires.reponses.data.label" },
        labelIndex: { $first: "$labelIndex" },
        nbReponses: { $sum: 1 },
      },
    },
    { $sort: { "cfa.siret": 1, reponse: 1 } },
  ]);

  return oleoduc([
    stream,
    transformObject((result) => {
      console.log(result.label.split(","), result.labelIndex);
      return {
        "CFA nom": result.cfa.nom,
        "CFA UAI": result.cfa.uaiFormateur,
        "CFA siret": result.cfa.siret,
        reponse: result.reponse,
        label: result.label.split(",")[result.labelIndex || 0],
        nbReponses: result.nbReponses,
      };
    }),
  ]);
};
