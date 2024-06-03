const { VERBATIM_STATUS, ANSWER_LABELS_TO_VERBATIM_THEMES } = require("../constants");

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
  const emojiMapping = ["😫", "🧐", "😊", "😝"];

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
      acc[val] = acc[val] || Array(intermediate.length).fill(0);
      acc[val][intermediate.indexOf(response)] += 1;
    });
    return acc;
  }, {});

  const data = Object.entries(counts).map(([key, value]) => ({
    [key]: value,
    emoji: emojiMapping[key],
  }));

  const questions = intermediate.map((response) => response.label);

  return { data, questions };
};

const multiEmojiResponsesFormatting = (responses) => {
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
      acc[val] = acc[val] || Array(intermediate.length).fill(0);
      acc[val][intermediate.indexOf(response)] += 1;
    });
    return acc;
  }, {});

  const data = Object.entries(counts).map(([key, value]) => ({
    [key]: value,
  }));

  const questions = intermediate.map((response) => response.label);

  return { data, questions };
};

const verbatimsResponsesFormatting = (responses) => {
  const cleanedUpResponses = responses
    .map((response) => {
      if (
        response &&
        [VERBATIM_STATUS.VALIDATED, VERBATIM_STATUS.TO_FIX, VERBATIM_STATUS.GEM].includes(response.status)
      ) {
        return response;
      }
    })
    .filter(Boolean);

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
    const formattedTemoignages = temoignages.map((temoignage) => {
      if (temoignage.value === "Pas ok" || temoignage.value === "Pas vraiment") {
        return { ...temoignage, value: 0 };
      }
      if (temoignage.value === "Moyen") {
        return { ...temoignage, value: 1 };
      }
      if (temoignage.value === "Oui" || temoignage.value === "Bien") {
        return { ...temoignage, value: 2 };
      }
    });
    return multiEmojiResponsesFormatting(formattedTemoignages, widget.mapping);
  }

  if (widget.type === "text") {
    return verbatimsResponsesFormatting(temoignages);
  }
};

const appendFormationDataWhenEmpty = (campagne) => {
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
};

const getReponseRating = (responses) => {
  const counts = {
    Mal: responses.filter((el) => el === "Mal").length,
    Moyen: responses.filter((el) => el === "Moyen").length,
    Bien: responses.filter((el) => el === "Bien").length,
  };

  const totalEntries = responses.length;
  const rates = {
    Mal: (counts.Mal * 10) / totalEntries,
    Moyen: (counts.Moyen * 10) / totalEntries,
    Bien: (counts.Bien * 10) / totalEntries,
  };

  // Round the rates and compute the total
  const roundedRates = {
    Mal: Math.round(rates.Mal),
    Moyen: Math.round(rates.Moyen),
    Bien: Math.round(rates.Bien),
  };

  const totalRounded = roundedRates.Mal + roundedRates.Moyen + roundedRates.Bien;

  // Adjust the rates if the total is not 10
  if (totalRounded !== 10) {
    const diffs = [
      { key: "Mal", diff: rates.Mal - roundedRates.Mal },
      { key: "Moyen", diff: rates.Moyen - roundedRates.Moyen },
      { key: "Bien", diff: rates.Bien - roundedRates.Bien },
    ];

    // Sort by the largest difference
    diffs.sort((a, b) => b.diff - a.diff);

    // Adjust the largest difference
    roundedRates[diffs[0].key] += totalRounded > 10 ? -1 : 1;
  }

  return roundedRates;
};

const commentVisTonExperienceEntrepriseLabelReconciler = (label) => {
  if (!label) return null;
  const labelMap = {
    "Je n'ai plus autant de vacances": "D’avoir moins de <strong>vacances</strong>",
    "Le rythme entreprise / école": "<strong>Le rythme</strong> entreprise <-> école",
    "Les horaires de travail": "<strong>Les horaires</strong> en entreprise",
    "Les taches qu’on me confie lors de l’apprentissage de mon métier":
      "<strong>Ce que tu apprends de ce métier</strong> dans ton entreprise",
    "L'ambiance à l'entreprise et mon intégration":
      "<strong>Ton intégration et l’ambiance</strong> dans ton entreprise",
    "Les relations avec mes collègues et mon maître d’apprentissage":
      "<strong>Ton intégration et l’ambiance</strong> dans ton entreprise",
  };

  return labelMap[label] || label;
};

const getCommentVisTonExperienceEntrepriseOrder = (commentVisTonExperienceEntrepriseResults) => {
  const valueMapString = {
    "Pas ok": 0,
    Moyen: 1,
    Bien: 2,
  };

  const valueMapNumber = {
    1: 0,
    2: 1,
    3: 2,
  };

  // Step 1: Create a map to store the total values for each label
  const labelTotals = {};

  commentVisTonExperienceEntrepriseResults.forEach((itemList) => {
    itemList?.forEach((item) => {
      const label = commentVisTonExperienceEntrepriseLabelReconciler(item.label);
      const value = typeof item.value === "number" ? valueMapNumber[item.value] : valueMapString[item.value]; // needed to reconcile the different formats of the values coming from different questionnaire versions

      if (!labelTotals[label]) {
        labelTotals[label] = 0;
      }
      labelTotals[label] += value;
    });
  });

  // Step 2: Convert the map to an array of objects and sort them by total value
  const sortedLabels = Object.keys(labelTotals)
    .map((label) => ({ label, total: labelTotals[label] }))
    .sort((a, b) => b.total - a.total);

  return sortedLabels;
};

const getGemVerbatimsByWantedQuestionKey = (verbatims) => {
  const questionKeyOrder = [
    "descriptionMetierConseil",
    "peurChangementConseil",
    "choseMarquanteConseil",
    "trouverEntrepriseConseil",
  ];

  const groupedVerbatims = verbatims.reduce((acc, verbatim) => {
    const { questionKey, content } = verbatim;
    if (questionKeyOrder.includes(questionKey)) {
      acc[questionKey] = acc[questionKey] || [];
      acc[questionKey].push(content);
    }
    return acc;
  }, {});

  return groupedVerbatims;
};

const verbatimAndcommentVisTonEntrepriseMatcher = (verbatims, commentVisTonEntrepriseOrder) => {
  const result = commentVisTonEntrepriseOrder.map((item) => {
    const theme = ANSWER_LABELS_TO_VERBATIM_THEMES[item.label];
    const verbatimsForTheme = verbatims
      .filter((verbatim) => verbatim.themes[theme] === true)
      .map((verbatim) => ({
        content: verbatim.content,
        status: verbatim.status,
      }))
      .sort((a, b) => {
        if (a.status.includes(VERBATIM_STATUS.GEM) && !b.status.includes(VERBATIM_STATUS.GEM)) {
          return -1;
        } else if (!a.status.includes(VERBATIM_STATUS.GEM) && b.status.includes(VERBATIM_STATUS.GEM)) {
          return 1;
        }
        return 0;
      })
      .splice(0, 10);

    return { ...item, verbatims: verbatimsForTheme };
  });

  return result;
};

module.exports = {
  matchIdAndQuestions,
  matchCardTypeAndQuestions,
  getCategoriesWithEmojis,
  getFormattedResponses,
  appendFormationDataWhenEmpty,
  getReponseRating,
  getCommentVisTonExperienceEntrepriseOrder,
  getGemVerbatimsByWantedQuestionKey,
  verbatimAndcommentVisTonEntrepriseMatcher,
};
