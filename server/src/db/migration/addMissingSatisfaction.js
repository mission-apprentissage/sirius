const { getNbModifiedDocuments } = require("../../core/mongoUtils");
const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };

  await oleoduc(
    db.collection("apprentis").find({ "contrats.questionnaires.questions.id": "ateliers" }),
    transformObject((apprenti) => {
      return {
        ...apprenti,
        contrats: apprenti.contrats.map((contrat) => {
          return {
            ...contrat,
            questionnaires: contrat.questionnaires.map((questionnaire) => {
              if (questionnaire.type !== "finAnnee") {
                return questionnaire;
              }

              return {
                ...questionnaire,
                questions: questionnaire.questions.map((question) => {
                  if (question.id !== "ateliers") {
                    return question;
                  }

                  return {
                    ...question,
                    reponses: question.reponses.map((reponse) => {
                      let mapper = {
                        1000: "BON",
                        2000: "BON",
                        2500: "BON",
                        3000: "MAUVAIS",
                        3500: "MAUVAIS",
                        4000: "MAUVAIS",
                      };
                      reponse.satisfaction = mapper[reponse.id];
                      return reponse;
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    }),
    writeObject(
      async (apprenti) => {
        let results = await db.collection("apprentis").replaceOne({ _id: apprenti._id }, apprenti);

        stats.updated += getNbModifiedDocuments(results);
      },
      { parallel: 2 }
    )
  );

  return stats;
};
