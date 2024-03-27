const { VERBATIM_STATUS } = require("../constants");

const matchIdAndQuestions = (questionnaire) => {
  if (!questionnaire || !questionnaire.properties) {
    return null;
  }

  const questionnaireProperties = questionnaire.properties;
  const results = [];

  Object.keys(questionnaireProperties).forEach((category) => {
    const obj = {};
    const properties = questionnaireProperties[category].properties;
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

const matchCardTypeAndQuestions = (questionnaire, questionnaireUI) => {
  if (!questionnaire || !questionnaire.properties) {
    return null;
  }
  const questionnaireProperties = questionnaire.properties;
  const results = [];

  Object.keys(questionnaireProperties).forEach((category) => {
    const obj = {};
    const properties = questionnaireProperties[category].properties;

    Object.keys(properties).forEach((question) => {
      if (
        properties[question].type === "array" &&
        Object.prototype.hasOwnProperty.call(properties[question], "questions") &&
        !Object.prototype.hasOwnProperty.call(properties[question], "subType")
      ) {
        obj[question] = "bar";
      } else if (
        (properties[question].type === "string" &&
          Object.prototype.hasOwnProperty.call(properties[question], "enum")) ||
        (properties[question].type === "array" &&
          !Object.prototype.hasOwnProperty.call(properties[question], "subType"))
      ) {
        obj[question] = "pie";
      } else if (
        properties[question].type === "string" &&
        !Object.prototype.hasOwnProperty.call(properties[question], "enum") &&
        !Object.prototype.hasOwnProperty.call(properties[question], "subType")
      ) {
        obj[question] = "text";
      } else if (properties[question].type === "string" && properties[question].subType === "emoji") {
        const uiData = questionnaireUI[category][question];
        obj[question] = { type: "emoji", mapping: uiData.emojisMapping };
      } else if (properties[question].type === "array" && properties[question].subType === "multiEmoji") {
        const uiData = questionnaireUI[category][question];
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

const getCategoriesWithEmojis = (questionnaire) => {
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

const pieResponsesFormatting = (responses) =>
  responses.reduce((acc, name) => {
    if (name) {
      const index = acc.findIndex((item) => item.name === name);
      if (index !== -1) {
        acc[index].value++;
      } else {
        acc.push({ name, value: 1 });
      }
    }
    return acc;
  }, []);

const barResponsesFormatting = (responses) => {
  const cleanedUpResponses = responses
    .map((response) => Object.keys(response).includes("label") && response)
    .filter((elem) => elem);

  const intermediate = cleanedUpResponses.reduce((acc, response) => {
    const index = acc?.findIndex((item) => item.label === response.label);
    if (index === -1) {
      acc.push({ label: response.label, value: [response.value] });
    } else {
      acc[index].value = [...acc[index].value, response.value];
    }
    return acc;
  }, []);

  const counts = intermediate.reduce((acc, response) => {
    response.value.forEach((val) => {
      acc[val] = (acc[val] || 0) + 1;
    });
    return acc;
  }, {});

  const emojiMap = {
    0: "😫",
    1: "🧐",
    2: "😊",
    3: "😝",
  };

  return Object.entries(counts).map(([key, value]) => ({
    name: key,
    emoji: emojiMap[key],
    value: value,
  }));
};

const multiEmojiResponsesFormatting = (responses, mapping) => {
  const cleanedUpResponses = responses
    .map((response) => Object.keys(response).includes("label") && response)
    .filter((elem) => elem);

  const intermediate = cleanedUpResponses.reduce((acc, response) => {
    const index = acc?.findIndex((item) => item.label === response.label);
    if (index === -1) {
      acc.push({ label: response.label, value: [response.value] });
    } else {
      acc[index].value = [...acc[index].value, response.value];
    }
    return acc;
  }, []);

  const counts = intermediate.reduce((acc, response) => {
    response.value.forEach((val) => {
      acc[val] = (acc[val] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(counts).map(([key, value]) => ({
    name: key,
    emoji: mapping.filter((emoji) => emoji.value === key)[0].emoji,
    value: value,
  }));
};

const verbatimsResponsesFormatting = (responses) => {
  const cleanedUpResponses = responses.map((response) => {
    if (
      response &&
      [VERBATIM_STATUS.VALIDATED, VERBATIM_STATUS.TO_FIX, VERBATIM_STATUS.GEM].includes(response.status)
    ) {
      return response;
    }
  });

  return cleanedUpResponses;
};

const getFormattedResponses = (temoignages, widget) => {
  if (widget.type === "pie" || widget.type === "emoji") {
    return pieResponsesFormatting(temoignages);
  }

  if (widget.type === "bar") {
    return barResponsesFormatting(temoignages);
  }

  if (widget.type === "multiEmoji") {
    return multiEmojiResponsesFormatting(temoignages, widget.mapping);
  }

  if (widget.type === "text") {
    return verbatimsResponsesFormatting(temoignages);
  }
};

module.exports = {
  matchIdAndQuestions,
  matchCardTypeAndQuestions,
  getCategoriesWithEmojis,
  getFormattedResponses,
};
