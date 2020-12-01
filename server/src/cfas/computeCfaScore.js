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
          _id: "$cfa.uaiFormateur",
          cfa: { $first: "$cfa" },
          satisfactions: {
            $push: { thematique: "$_id.thematique", bon: "$bon", moyen: "$moyen", mauvais: "$mauvais" },
          },
        },
      },
      { $sort: { _id: -1 } },
    ])
    .stream();

  let computeNote = (satisfaction) => {
    let total = satisfaction.bon + satisfaction.moyen + satisfaction.mauvais;
    let note = satisfaction.bon * 1 - satisfaction.moyen * 0.5 - satisfaction.mauvais * 1;
    return note < 0 ? 0 : Math.round((note * 20) / total);
  };

  let computeNoteGlobale = (notes) => {
    let nbNotes = Object.keys(notes).length;
    let sum = Object.values(notes).reduce((acc, v) => acc + v, 0);

    return Math.round((sum * 20) / (nbNotes * 20));
  };

  await oleoduc(
    stream,
    transformObject((res) => {
      let notes = res.satisfactions.reduce((acc, satisfaction) => {
        return {
          ...acc,
          [satisfaction.thematique]: computeNote(satisfaction),
        };
      }, {});

      return {
        cfa: res.cfa,
        ...notes,
        global: computeNoteGlobale(notes),
      };
    }),
    transformObjectIntoCSV({
      columns: {
        "Nom du cfa": (data) => data.cfa.nom,
        "UAI du cfa": (data) => data.cfa.uaiFormateur,
        "Note globale": (data) => data.global,
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
