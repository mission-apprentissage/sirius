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
  const ui = campagne.questionnaireUI;
  const results = [];

  Object.keys(questionnaire).forEach((category) => {
    const obj = {};
    const properties = questionnaire[category].properties;
    //TODO refacto using type from questionnaireUI
    Object.keys(properties).forEach((question) => {
      if (
        properties[question].type === "array" &&
        properties[question].hasOwnProperty("questions") &&
        !properties[question].hasOwnProperty("subType")
      ) {
        obj[question] = "bar";
      } else if (
        (properties[question].type === "string" && properties[question].hasOwnProperty("enum")) ||
        (properties[question].type === "array" && !properties[question].hasOwnProperty("subType"))
      ) {
        obj[question] = "pie";
      } else if (
        properties[question].type === "string" &&
        !properties[question].hasOwnProperty("enum") &&
        !properties[question].hasOwnProperty("subType")
      ) {
        obj[question] = "text";
      } else if (
        properties[question].type === "string" &&
        properties[question].subType === "emoji"
      ) {
        const uiData = ui[category][question];
        obj[question] = { type: "emoji", mapping: uiData.emojisMapping };
      } else if (
        properties[question].type === "array" &&
        properties[question].subType === "multiEmoji"
      ) {
        const uiData = ui[category][question];
        obj[question] = { type: "multiEmoji", mapping: uiData.emojisMapping };
      }
    });
    results.push(obj);
  });

  const flattenResult = results.reduce((acc, cur) => {
    return { ...acc, ...cur };
  }, {});

  return flattenResult;
};

const getMedian = (values) => {
  const sorted = Array.from(values).sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return Math.round(sorted[middle]);
};

export const msToTime = (duration) => {
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

export const getMedianDuration = (answers) => {
  if (answers.length === 0) return 0;
  const durations = answers.map(
    (answer) => new Date(answer.updatedAt).getTime() - new Date(answer.createdAt).getTime()
  );

  return msToTime(getMedian(durations));
};

const getChampsLibreField = (questionnaireUI) => {
  const fieldsWithCustomMessageReceived = [];

  for (const category in questionnaireUI) {
    const categoryFields = questionnaireUI[category];

    for (const field in categoryFields) {
      const widget = categoryFields[field]["ui:widget"];

      if (widget === "customMessageReceived") {
        fieldsWithCustomMessageReceived.push(field);
      }
    }
  }

  return fieldsWithCustomMessageReceived;
};

export const getChampsLibreRate = (questionnaireUI, temoignages) => {
  const champsLibreField = getChampsLibreField(questionnaireUI);

  const champsLibresFieldsCountWithAnswer = temoignages.reduce((acc, cur) => {
    const answers = Object.keys(cur.reponses);
    const count = answers.filter((answer) => champsLibreField.includes(answer)).length;
    return acc + count;
  }, 0);

  const champsLibresFieldsCount = champsLibreField.length * temoignages.length;

  const rate = Math.round((champsLibresFieldsCountWithAnswer / champsLibresFieldsCount) * 100);
  return rate || 0;
};
