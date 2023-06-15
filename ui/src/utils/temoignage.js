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
        properties[question].type === "array" &&
        properties[question].hasOwnProperty("questions")
      ) {
        obj[question] = "bar";
      } else if (
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
};

export const getMedianDuration = (answers) => {
  if (answers.length === 0) return 0;
  const durations = answers.map(
    (answer) => new Date(answer.updatedAt).getTime() - new Date(answer.createdAt).getTime()
  );

  return msToTime(getMedian(durations));
};
