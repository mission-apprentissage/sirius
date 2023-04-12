export const matchIdAndQuestions = (campagne) => {
  if (!campagne || !campagne.questionnaire || !campagne.questionnaire.properties) {
    return null;
  }

  const questionnaire = campagne.questionnaire.properties;
  const results = [];

  Object.keys(questionnaire).forEach((category) => {
    const obj = {};
    const properties = questionnaire[category].properties;
    Object.keys(properties).forEach((question) => {
      obj[question] = properties[question].title;
    });
    results.push(obj);
  });

  const flattenResult = results.reduce((acc, cur) => {
    return { ...acc, ...cur };
  }, {});

  return flattenResult;
};

export const matchCardTypeAndQuestions = (campagne) => {
  if (!campagne || !campagne.questionnaire || !campagne.questionnaire.properties) {
    return null;
  }

  const questionnaire = campagne.questionnaire.properties;
  const results = [];

  Object.keys(questionnaire).forEach((category) => {
    const obj = {};
    const properties = questionnaire[category].properties;
    Object.keys(properties).forEach((question) => {
      if (
        (properties[question].type === "string" && properties[question].hasOwnProperty("enum")) ||
        properties[question].type === "array"
      ) {
        obj[question] = "pie";
      } else if (
        properties[question].type === "string" &&
        !properties[question].hasOwnProperty("enum")
      ) {
        obj[question] = "text";
      }
    });
    results.push(obj);
  });

  const flattenResult = results.reduce((acc, cur) => {
    return { ...acc, ...cur };
  }, {});

  return flattenResult;
};
