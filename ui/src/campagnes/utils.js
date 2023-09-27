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
        error.message = "Erreur de validation";
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
