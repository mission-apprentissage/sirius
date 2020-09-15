const { oleoduc, transformObject } = require("oleoduc");

module.exports = (db) => {
  let stream = db.collection("contrats").aggregate([
    { $match: { "questionnaires.status": "closed" } },
    { $unwind: "$questionnaires" },
    { $unwind: "$questionnaires.reponses" },
    { $unwind: "$questionnaires.reponses.results" },
    {
      $group: {
        _id: {
          cfa: "$cfa.siret",
          reponse: "$questionnaires.reponses.id",
          result: "$questionnaires.reponses.result.id",
        },
        cfa: { $first: "$cfa" },
        reponse: { $first: "$questionnaires.reponses.id" },
        label: { $first: "$questionnaires.reponses.results.label" },
        nbReponses: { $sum: 1 },
      },
    },
    { $sort: { "cfa.siret": 1, reponse: 1 } },
  ]);

  return oleoduc([
    stream,
    transformObject((res) => {
      return {
        "CFA nom": res.cfa.nom,
        "CFA UAI": res.cfa.uaiFormateur,
        "CFA siret": res.cfa.siret,
        reponse: res.reponse,
        label: res.label,
        nbReponses: res.nbReponses,
      };
    }),
  ]);
};
