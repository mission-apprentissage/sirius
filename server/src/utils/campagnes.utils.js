const getMedian = (values) => {
  const sorted = Array.from(values).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return Math.round(sorted[middle]);
};

const getMedianDuration = (answers) => {
  if (answers.length === 0) return 0;
  const durations = answers.map(
    (answer) => new Date(answer.lastQuestionAt).getTime() - new Date(answer.createdAt).getTime()
  );

  return getMedian(durations);
};

const appendDataWhenEmpty = (campagne) => {
  if (!campagne.formation) {
    campagne.formation = {
      _id: "N/A",
      data: {
        intitule_long: "N/A",
        tags: [],
        lieu_formation_adresse_computed: "N/A",
        diplome: "N/A",
        localite: "N/A",
        duree: 0,
        etablissement_formateur_siret: "N/A",
        etablissement_gestionnaire_siret: "N/A",
        etablissement_gestionnaire_enseigne: "N/A",
        etablissement_formateur_enseigne: "N/A",
        etablissement_formateur_entreprise_raison_sociale: "N/A",
      },
    };
  }
  if (!campagne.etablissement) {
    campagne.etablissement = {
      _id: "N/A",
      formationIds: [],
      data: {
        onisep_nom: "N/A",
        enseigne: "N/A",
        entreprise_raison_sociale: "N/A",
        siret: "N/A",
        numero_voie: "N/A",
        type_voie: "N/A",
        nom_voie: "N/A",
        code_postal: "N/A",
        localite: "N/A",
      },
    };
  }
};

module.exports = {
  getMedianDuration,
  appendDataWhenEmpty,
};
