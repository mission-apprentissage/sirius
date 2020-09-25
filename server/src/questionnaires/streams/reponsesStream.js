const { oleoduc, transformObject } = require("oleoduc");

module.exports = (db) => {
  let stream = db.collection("contrats").aggregate([
    { $match: { "questionnaires.status": "closed" } },
    { $unwind: "$questionnaires" },
    { $unwind: "$questionnaires.questions" },
    { $unwind: "$questionnaires.questions.reponses" },
    {
      $group: {
        _id: {
          cfa: "$cfa.siret",
          question: "$questionnaires.questions.id",
          reponses: "$questionnaires.questions.reponses.id",
        },
        cfa: { $first: "$cfa" },
        reponse: { $first: "$questionnaires.questions.id" },
        label: { $first: "$questionnaires.questions.reponses.label" },
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
