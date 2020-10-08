const { getNbModifiedDocuments } = require("../../core/mongoUtils");
const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };

  await oleoduc(
    db.collection("contrats").find({
      $or: [
        { "questionnaires.status": { $in: ["sent", "error", "opened", "clicked"] } },
        { "questionnaires.status": { $exists: false } },
      ],
    }),
    transformObject((contrat) => {
      contrat.questionnaires = contrat.questionnaires.map((q) => {
        let results;
        if (q.reponses) {
          q.questions = q.reponses.map((reponse) => {
            let reponseId = reponse.id;
            let data = reponse.data;
            let reponseMapperIds = {
              difficultesPrecisions: "difficultesPasseesOrigines",
              difficultesPasseesSolutions: "difficultesConseil",
            };

            if (Array.isArray(data.value)) {
              let labels = data.label.split(",");
              results = data.value.map((v, index) => {
                return {
                  id: v * 1000,
                  label: labels[index],
                };
              });
            } else if (typeof data.value === "boolean") {
              results = [
                {
                  id: 1000,
                  label: data.label,
                },
              ];
            } else {
              results = [
                {
                  id: data.value * 1000,
                  label: data.label,
                },
              ];
            }

            return {
              id: reponseMapperIds[reponseId] ? reponseMapperIds[reponseId] : reponseId,
              reponses: results.map((result) => {
                let mapper = [];
                if (reponseId === "suivi") {
                  mapper = [
                    { id: 1000, satisfaction: "BON", label: "Bon suivi" },
                    { id: 2000, satisfaction: "MOYEN", label: "Peut s’améliorer" },
                    { id: 3000, satisfaction: "MAUVAIS", label: "Aucun suivi" },
                  ];
                } else if (reponseId === "suiviPrecisions") {
                  mapper = [
                    { id: 4000, satisfaction: "BON", label: "Le CFA est venu en entreprise" },
                    {
                      id: 3000,
                      satisfaction: "BON",
                      label: "Le CFA a réuni les tuteurs",
                    },
                    {
                      id: 2000,
                      satisfaction: "BON",
                      label: "Le CFA et mon tuteur sont en contact régulier",
                    },
                    { id: 1000, satisfaction: "MOYEN", label: "Je fais un rapport périodique" },
                  ];
                } else if (reponseId === "difficultesPasseesOrigines") {
                  mapper = [
                    {
                      id: 1000,
                      label: "mon CFA",
                    },
                    {
                      id: 3000,
                      label: "Mes collègues de travail",
                    },
                    {
                      id: 2500,
                      label: "Les congés",
                    },
                    {
                      id: 5000,
                      label: "Les transports",
                    },
                    {
                      id: 2000,
                      label: "mon tuteur",
                    },
                    {
                      id: 4000,
                      label: "Le rythme vie pro / vie perso",
                    },
                    {
                      id: 6000,
                      label: "Difficultés financières",
                    },
                    {
                      id: 5500,
                      label: "Le logement",
                    },
                  ];
                } else if (reponseId === "difficultesPasseesSolutions") {
                  mapper = [
                    {
                      id: 1000,
                      label: "J’en ai parlé à mon tuteur",
                    },
                    {
                      id: 3000,
                      satisfaction: "BON",
                      label: "J’en ai parlé au médiateur",
                    },
                    {
                      id: 5000,
                      label: "Je n’ai rien dit à personne",
                    },
                    {
                      id: 2500,
                      satisfaction: "BON",
                      label: "J’en ai parlé au CFA",
                    },
                    {
                      id: 4000,
                      label: "J'en ai parlé à mes parents",
                    },
                  ];
                } else if (reponseId === "ambiance") {
                  mapper = [
                    {
                      id: 1000,
                      satisfaction: "BON",
                      label: "Bonne",
                    },
                    {
                      id: 2000,
                      satisfaction: "MAUVAIS",
                      label: "Sans plus",
                    },
                  ];
                } else if (reponseId === "ateliers") {
                  mapper = [
                    {
                      id: 1000,
                      label: "Récents",
                      satisfaction: "BON",
                    },
                    {
                      id: 2500,
                      label: "Equivalents à ceux de l'entreprise",
                      satisfaction: "BON",
                    },
                    {
                      id: 3500,
                      label: "Inadaptés",
                      satisfaction: "MAUVAIS",
                    },
                    {
                      id: 4000,
                      label: "En nombre insuffisant",
                      satisfaction: "MAUVAIS",
                    },
                  ];
                } else if (reponseId === "fierte") {
                  mapper = [
                    {
                      id: 1000,
                      label: "Je communique mieux",
                    },
                    {
                      id: 2000,
                      label: "J’ai été félicité.e pour mon travail",
                    },
                    {
                      id: 3000,
                      label: "Je suis plus autonome dans la vie de tous les jours",
                    },
                    {
                      id: 4000,
                      label: "J'ai trouvé ma voie, je me sens à ma place",
                    },
                    {
                      id: 5000,
                      label: "Je me suis fait un beau cadeau grâce à mon salaire",
                    },
                  ];
                }

                return mapper.find((mapping) => mapping.id === result.id) || result;
              }),
            };
          });
        }

        delete q.reponses;
        return q;
      });

      return contrat;
    }),
    writeObject(
      async (contrat) => {
        let results = await db.collection("contrats").replaceOne({ _id: contrat._id }, contrat);

        stats.updated += getNbModifiedDocuments(results);
      },
      { parallel: 2 }
    )
  );

  return stats;
};
