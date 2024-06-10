import { msToTime } from "../utils/temoignage";

export const multiStepQuestionnaireFormatter = (questionnaire) => {
  if (
    !questionnaire ||
    !Object.keys(questionnaire).length ||
    !Object.keys(questionnaire).includes("properties") ||
    !Object.entries(questionnaire.properties).length
  )
    return null;
  return Object.entries(questionnaire.properties).map((property) => {
    const [key] = property;

    // format questions for each categories
    const nestedProperties = Object.entries(questionnaire.properties[key].properties).map(
      (property) => {
        const [nestedKey, nestedValue] = property;
        return {
          type: "object",
          properties: {
            [nestedKey]: {
              ...nestedValue,
            },
          },
          dependencies: {
            [nestedKey]: questionnaire.properties[key].dependencies[nestedKey],
          },
          required:
            questionnaire.properties[key].required.indexOf(nestedKey) !== -1 ? [nestedKey] : [],
        };
      }
    );
    // format category and returns them with formatted questions
    return {
      type: "object",
      properties: [...nestedProperties],
      dependencies:
        Object.entries(questionnaire.dependencies).indexOf(key) !== -1
          ? {
              [key]: [questionnaire.dependencies[key]],
            }
          : {},
      required: questionnaire.required.indexOf(key) !== -1 ? [key] : [],
    };
  });
};

export const multiStepQuestionnaireUIFormatter = (questionnaireUI) => {
  const categories = Object.entries(questionnaireUI).map((category) => {
    const [, value] = category;
    return value;
  });

  return categories;
};

export const transformErrors = (errors) => {
  return errors.map((error) => {
    switch (error.name) {
      case "required":
        error.message = "Ce champ est obligatoire";
        break;
      case "pattern":
        error.message = "Ce champ n'est pas au bon format";
        break;
      case "enum":
        error.message = "Ce champ est invalide";
        break;
      case "minItems":
        error.message = "Pas si vite ! Réponse obligatoire 😉";
        break;
      default:
        error.message = "Pas si vite ! Réponse obligatoire 😉";
        break;
    }
    return error;
  });
};

export const getCategoriesWithEmojis = (questionnaire) => {
  if (!questionnaire || !questionnaire.properties) return [];
  return Object.entries(questionnaire.properties).map((property) => {
    const [key, content] = property;
    return {
      id: key,
      title: content.title,
      emoji: content.emoji,
      questionCount: Object.keys(content.properties).length,
    };
  });
};

export const getNextButtonLabel = (isLastCategory, isLastQuestionInCategory) => {
  if (isLastCategory && isLastQuestionInCategory) {
    return "Terminer";
  } else if (isLastQuestionInCategory) {
    return "Partie suivante";
  } else {
    return "Suivant";
  }
};

const padTo2Digits = (num) => {
  return num.toString().padStart(2, "0");
};

export const formatDate = (date) => {
  const typedDate = new Date(date);
  return [
    padTo2Digits(typedDate.getDate()),
    padTo2Digits(typedDate.getMonth() + 1),
    typedDate.getFullYear(),
  ].join("/");
};

export const formateDateToInputFormat = (date, monthsAdded = 0) => {
  let year = date.getFullYear();
  let month = date.getMonth() + monthsAdded;

  if (month > 11) {
    year += Math.floor(month / 12);
    month %= 12;
  }

  const formattedMonth = String(month + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${formattedMonth}-${day}`;
};

export const getUniqueDiplomeTypesFromCampagne = (campagnes) =>
  campagnes?.length
    ? [...new Set(campagnes.map((campagne) => campagne.formation?.data?.diplome))].sort()
    : [];

export const getUniqueDiplomeTypesFromFormation = (formations) =>
  formations?.length ? [...new Set(formations.map((formation) => formation.diplome))].sort() : [];

export const getUniqueEtablissementFromCampagne = (campagnes) =>
  campagnes?.length
    ? [
        ...new Set(
          campagnes.map((campagne) => campagne.formation.data.etablissement_formateur_siret)
        ),
      ].sort()
    : [];

export const getUniqueEtablissementFromFormation = (formations) =>
  formations?.length
    ? [...new Set(formations.map((formation) => formation.etablissement_formateur_siret))].sort()
    : [];

export const orderCampagnesByDiplomeType = (campagnes) => {
  const orderedCampagnes = {};
  getUniqueDiplomeTypesFromCampagne(campagnes)?.forEach((diplomeType) => {
    const campagnesByDiplomeType = campagnes.filter(
      (campagne) => campagne.formation?.data?.diplome === diplomeType
    );
    orderedCampagnes[diplomeType] = campagnesByDiplomeType;
  });
  return orderedCampagnes;
};

export const orderFormationsByDiplomeType = (formations = []) => {
  const orderedFormations = {};
  getUniqueDiplomeTypesFromFormation(formations)?.forEach((diplomeType) => {
    const formationsByDiplomeType = formations.filter(
      (formation) => formation?.diplome === diplomeType
    );
    orderedFormations[diplomeType] = formationsByDiplomeType;
  });
  return orderedFormations;
};

export const orderCampagnesByEtablissement = (campagnes) => {
  const orderedCampagnes = {};
  campagnes.forEach((campagne) => {
    const { formation } = campagne;
    if (!orderedCampagnes[formation.data.etablissement_formateur_siret]) {
      orderedCampagnes[formation.data.etablissement_formateur_siret] = [];
    }
    orderedCampagnes[formation.data.etablissement_formateur_siret].push(campagne);
  });
  return orderedCampagnes;
};

export const orderFormationByEtablissement = (formations = []) => {
  const orderedFormations = {};
  formations.forEach((formation) => {
    const { etablissement_formateur_siret } = formation;
    if (!orderedFormations[etablissement_formateur_siret]) {
      orderedFormations[etablissement_formateur_siret] = [];
    }
    orderedFormations[etablissement_formateur_siret].push(formation);
  });
  return orderedFormations;
};

export const isPlural = (count) => ((count && count) > 1 ? "s" : "");

const getValue = (obj, key) => {
  const value = obj[key];
  return typeof value === "string" ? value.toLowerCase() : value;
};

export const sortingKeys = (a, b) => ({
  "formation-asc": () =>
    getValue(a.formation.data, "intitule_long").localeCompare(
      getValue(b.formation.data, "intitule_long")
    ),
  "formation-desc": () =>
    getValue(b.formation.data, "intitule_long").localeCompare(
      getValue(a.formation.data, "intitule_long")
    ),
  "nomCampagne-asc": () => getValue(a, "nomCampagne").localeCompare(getValue(b, "nomCampagne")),
  "nomCampagne-desc": () => getValue(b, "nomCampagne").localeCompare(getValue(a, "nomCampagne")),
  "startDate-asc": () => getValue(a, "startDate").localeCompare(getValue(b, "startDate")),
  "startDate-desc": () => getValue(b, "startDate").localeCompare(getValue(a, "startDate")),
  "endDate-asc": () => getValue(a, "endDate").localeCompare(getValue(b, "endDate")),
  "endDate-desc": () => getValue(b, "endDate").localeCompare(getValue(a, "endDate")),
  "seats-asc": () => (a?.seats === 0 ? 999 : a?.seats) - (b?.seats === 0 ? 999 : b?.seats),
  "seats-desc": () => (b?.seats === 0 ? 999 : b?.seats) - (a?.seats === 0 ? 999 : a?.seats),
});

export const getFinishedCampagnes = (campagnes) => {
  return campagnes.filter((campagne) => new Date(campagne.endDate) < new Date());
};

export const getTemoignagesCount = (campagnes) => {
  return campagnes.reduce((acc, campagne) => acc + campagne.temoignagesCount, 0);
};

export const getChampsLibreRate = (campagnes) => {
  const filteredCampagnes = campagnes.filter((campagne) => campagne.temoignagesCount > 0);

  if (!filteredCampagnes.length) {
    return "N/A";
  }

  const sum = filteredCampagnes.reduce((acc, campagne) => acc + campagne.champsLibreRate, 0);
  return Math.round(sum / filteredCampagnes.length) + "%";
};

export const getMedianDuration = (campagnes) => {
  const filteredCampagnes = campagnes.filter((campagne) => campagne.temoignagesCount > 0);

  if (!filteredCampagnes.length) {
    return "N/A";
  }

  const sum = filteredCampagnes.reduce((acc, campagne) => acc + campagne.medianDurationInMs, 0);
  return msToTime(Math.round(sum / filteredCampagnes.length));
};

export const getVerbatimsCount = (campagnes) => {
  return campagnes.reduce((acc, campagne) => acc + campagne.champsLibreCount, 0);
};

export const getStatistics = (campagnes) => ({
  campagnesCount: campagnes?.length || 0,
  finishedCampagnesCount: campagnes?.length ? getFinishedCampagnes(campagnes).length : 0,
  temoignagesCount: campagnes?.length ? getTemoignagesCount(campagnes) : 0,
  champsLibreRate: campagnes?.length ? getChampsLibreRate(campagnes) : "N/A",
  medianDuration: campagnes?.length ? getMedianDuration(campagnes) : "N/A",
  verbatimsCount: campagnes?.length ? getVerbatimsCount(campagnes) : "0",
});

export const splitIntoBatches = (array, batchSize) => {
  const batchedArray = [];
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    batchedArray.push(batch);
  }
  return batchedArray;
};

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getChampsLibreField = (questionnaireUI, onlyOpenQuestions = false) => {
  const fieldsWithCustomMessageReceived = [];

  for (const category in questionnaireUI) {
    const categoryFields = questionnaireUI[category];

    for (const field in categoryFields) {
      const widget = categoryFields[field]["ui:widget"];
      if (onlyOpenQuestions) {
        if (widget === "customMessageReceived") {
          fieldsWithCustomMessageReceived.push(field);
        }
      } else {
        if (widget === "customMessageReceived" || widget === "textarea") {
          fieldsWithCustomMessageReceived.push(field);
        }
      }
    }
  }

  return fieldsWithCustomMessageReceived;
};
