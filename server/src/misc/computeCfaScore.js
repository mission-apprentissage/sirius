const { createWriteStream } = require("fs");
const { oleoduc, transformObject } = require("oleoduc");
const { transformObjectIntoCSV, encodeIntoUTF8 } = require("../core/streamUtils");

module.exports = async (db, outputFile) => {
  const csvFile = outputFile || "scores.csv";

  let stream = db
    .collection("apprentis")
    .aggregate([
      { $unwind: "$contrats" },
      { $unwind: "$contrats.questionnaires" },
      { $unwind: "$contrats.questionnaires.questions" },
      { $unwind: "$contrats.questionnaires.questions.reponses" },
      {
        $match: {
          "contrats.questionnaires.status": "closed",
          "contrats.questionnaires.questions.thematique": { $exists: true },
        },
      },
      {
        $project: {
          cfa: "$contrats.cfa",
          question: "$contrats.questionnaires.questions",
          reponse: "$contrats.questionnaires.questions.reponses",
        },
      },
      {
        $group: {
          _id: { cfa: "$cfa.uaiFormateur", thematique: "$question.thematique" },
          cfa: { $first: "$cfa" },
          mauvais: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$reponse.satisfaction", "MAUVAIS"],
                },
                then: 1,
                else: 0,
              },
            },
          },
          moyen: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$reponse.satisfaction", "MOYEN"],
                },
                then: 1,
                else: 0,
              },
            },
          },
          bon: {
            $sum: {
              $cond: {
                if: {
                  $eq: ["$reponse.satisfaction", "BON"],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
      {
        $group: {
          _id: { cfa: "$cfa.uaiFormateur" },
          cfa: { $first: "$cfa" },
          thematiques: { $push: { thematique: "$_id.thematique", bon: "$bon", moyen: "$moyen", mauvais: "$mauvais" } },
        },
      },
    ])
    .stream();

  await oleoduc(
    stream,
    transformObject((res) => {
      return {
        cfa: res.cfa,
        ...res.thematiques.reduce((acc, t) => {
          let total = t.bon + t.moyen + t.mauvais;
          let value = t.bon - t.mauvais;
          let note = value < 0 ? 0 : value;
          console.log(res.cfa.uaiFormateur, t.thematique, t);
          return {
            ...acc,
            [t.thematique]: note === 0 ? 0 : Math.round((note * 20) / total),
          };
        }, {}),
      };
    }),
    transformObjectIntoCSV({
      columns: {
        "Nom du cfa": (data) => data.cfa.nom,
        "UAI du cfa": (data) => data.cfa.uaiFormateur,
        "Le CFA est en relation avec les entreprises": (data) => data.cfaRelationEntreprise,
        "Ce que nous pensons des formateurs": (data) => data.formateurs,
        "Le CFA nous a aidés à être prêt pour l'examen": (data) => data.preparationExamen,
        "Notre avis sur le matériel du CFA (plateaux techniques)": (data) => data.matériel,
        "L'ambiance est bonne": (data) => data.ambiance,
      },
    }),
    encodeIntoUTF8(),
    createWriteStream(csvFile)
  );

  return { generated: csvFile };
};
