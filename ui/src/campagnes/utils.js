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

export const uniqueDiplomeTypesFromCampagne = (campagnes) => [
  ...new Set(campagnes.map((campagne) => campagne.formation?.data?.diplome)),
];

export const uniqueDiplomeTypesFromFormation = (formations) => [
  ...new Set(formations?.map((formation) => formation?.diplome)),
];

export const orderCampagnesByDiplomeType = (campagnes) => {
  const orderedCampagnes = {};
  uniqueDiplomeTypesFromCampagne(campagnes)?.forEach((diplomeType) => {
    const campagnesByDiplomeType = campagnes.filter(
      (campagne) => campagne.formation?.data?.diplome === diplomeType
    );
    orderedCampagnes[diplomeType] = campagnesByDiplomeType;
  });
  return orderedCampagnes;
};

export const orderFormationsByDiplomeType = (formations) => {
  const orderedFormations = {};
  uniqueDiplomeTypesFromFormation(formations)?.forEach((diplomeType) => {
    const formationsByDiplomeType = formations.filter(
      (formation) => formation?.diplome === diplomeType
    );
    orderedFormations[diplomeType] = formationsByDiplomeType;
  });
  return orderedFormations;
};
