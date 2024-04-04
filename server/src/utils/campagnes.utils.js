const msToTime = (duration) => {
  let seconds = Math.floor((duration / 1000) % 60);
  let minutes = Math.floor((duration / (1000 * 60)) % 60);
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  if (minutes === "00") return seconds + " sec";
  if (hours === "00") return minutes + " min " + seconds;
  return hours + " h " + minutes + " min " + seconds;
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

const getFinishedCampagnes = (campagnes) => {
  return campagnes.filter((campagne) => new Date(campagne.endDate) < new Date());
};

const getTemoignagesCount = (campagnes) => {
  return campagnes.reduce((acc, campagne) => acc + campagne.temoignagesCount, 0);
};

const getChampsLibreRate = (campagnes) => {
  const filteredCampagnes = campagnes.filter((campagne) => campagne.temoignagesCount > 0);

  if (!filteredCampagnes.length) {
    return "N/A";
  }

  const sum = filteredCampagnes.reduce((acc, campagne) => acc + campagne.champsLibreRate, 0);
  return Math.round(sum / filteredCampagnes.length) + "%";
};

const getMedianDuration = (campagnes) => {
  const filteredCampagnes = campagnes.filter((campagne) => campagne.temoignagesCount > 0);

  if (!filteredCampagnes.length) {
    return "N/A";
  }

  filteredCampagnes.forEach((campagne) => {
    campagne.medianDurationInMs =
      campagne.temoignagesList.reduce(
        (acc, answer) =>
          answer?.lastQuestionAt
            ? acc + new Date(answer?.lastQuestionAt).getTime() - new Date(answer?.createdAt).getTime()
            : 0,
        0
      ) / campagne.temoignagesList.length;
  });

  const sum = filteredCampagnes.reduce((acc, campagne) => acc + campagne.medianDurationInMs, 0);

  return msToTime(Math.round(sum / filteredCampagnes.length));
};

const getVerbatimsCount = (campagnes) => {
  return campagnes.reduce((acc, campagne) => acc + campagne.champsLibreCount, 0);
};

const getStatistics = (campagnes) => ({
  campagnesCount: campagnes?.length || 0,
  finishedCampagnesCount: campagnes?.length ? getFinishedCampagnes(campagnes).length : 0,
  temoignagesCount: campagnes?.length ? getTemoignagesCount(campagnes) : 0,
  champsLibreRate: campagnes?.length ? getChampsLibreRate(campagnes) : "N/A",
  medianDuration: campagnes?.length ? getMedianDuration(campagnes) : "N/A",
  verbatimsCount: campagnes?.length ? getVerbatimsCount(campagnes) : "0",
});

module.exports = {
  getMedianDuration,
  appendDataWhenEmpty,
  getStatistics,
};
