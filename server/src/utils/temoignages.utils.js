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
      id: "N/A",
      intituleLong: "N/A",
      tags: [],
      lieuFormationAdresseComputed: "N/A",
      diplome: "N/A",
      localite: "N/A",
      duree: 0,
      etablissementFormateurSiret: "N/A",
      etablissementGestionnaireSiret: "N/A",
      etablissementGestionnaireEnseigne: "N/A",
      etablissementFormateurEnseigne: "N/A",
      etablissementFormateurEntrepriseRaisonSociale: "N/A",
    };
  }
};

const getReponseRating = (responses) => {
  const counts = {
    Mal: responses.filter((el) => el === "Mal").length,
    Moyen: responses.filter((el) => el === "Moyen").length,
    Bien: responses.filter((el) => el === "Bien").length,
  };

  const totalEntries = counts.Mal + counts.Moyen + counts.Bien;
  const rates = {
    Mal: (counts.Mal * 100) / totalEntries,
    Moyen: (counts.Moyen * 100) / totalEntries,
    Bien: (counts.Bien * 100) / totalEntries,
  };

  // Round the rates and compute the total
  const roundedRates = {
    Mal: Math.round(rates.Mal),
    Moyen: Math.round(rates.Moyen),
    Bien: Math.round(rates.Bien),
  };

  const totalRounded = roundedRates.Mal + roundedRates.Moyen + roundedRates.Bien;

  // Adjust the rates if the total is not 100
  if (totalRounded !== 100) {
    const diffs = [
      { key: "Mal", diff: rates.Mal - roundedRates.Mal },
      { key: "Moyen", diff: rates.Moyen - roundedRates.Moyen },
      { key: "Bien", diff: rates.Bien - roundedRates.Bien },
    ];

    // Sort by the largest difference
    diffs.sort((a, b) => b.diff - a.diff);

    // Adjust the largest difference
    roundedRates[diffs[0].key] += totalRounded > 100 ? -1 : 1;
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

const verbatimsAnOrderedThemeAnswersMatcher = (verbatims, orderedThemeAnswers, matchedThemesAndLabels) => {
  const result = orderedThemeAnswers.map((item) => {
    const theme = matchedThemesAndLabels[item.label];

    if (theme === undefined) {
      return { ...item, verbatims: [] };
    }

    const verbatimsForTheme = verbatims
      .filter((verbatim) => verbatim && verbatim.themes && verbatim.themes[theme] === true)
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

const getCategoryTitleFromResponseKey = (responseKey, questionnaire) => {
  for (const categoryKey in questionnaire.properties) {
    const category = questionnaire.properties[categoryKey];
    if (category.properties && category.properties[responseKey]) {
      return category.title;
    }
  }
  return null;
};

const stripHtmlTags = (str) => {
  if (typeof str === "string") {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  }
  return str;
};

const getFormattedReponsesByTemoignages = (temoignages, questionnaires) => {
  return temoignages
    .flatMap((temoignage) => {
      const { reponses, formation, questionnaireId } = temoignage;
      const questionnaire = questionnaires.find((questionnaire) => questionnaire.id === questionnaireId).questionnaire;

      return Object.keys(reponses).flatMap((key) => {
        const isAutreKey = key.includes("Autre");
        const formattedKey = key.includes("Autre") ? key.split("Autre")[0] : key;

        if (typeof reponses[key] === "string") {
          return {
            value: stripHtmlTags(reponses[key]),
            formation: formation,
            question: isAutreKey
              ? stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]) + " - Autre"
              : stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]),
            theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
          };
        }
        if (Array.isArray(reponses[key]) && typeof reponses[key][0] === "string") {
          return reponses[key].map((response) => ({
            value: stripHtmlTags(response),
            formation: formation,
            question: isAutreKey
              ? stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]) + " - Autre"
              : stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]),
            theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
          }));
        }
        if (Array.isArray(reponses[key]) && typeof reponses[key][0] === "object") {
          return reponses[key].map((response) => ({
            value: stripHtmlTags(response.value),
            formation: formation,
            question: stripHtmlTags(`${matchIdAndQuestions(questionnaire)[formattedKey]} - ${response.label}`),
            theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
          }));
        }
        return [];
      });
    })
    .filter(Boolean);
};

const getFormattedReponsesByVerbatims = (verbatims, questionnaires) => {
  return verbatims
    .map((verbatim) => {
      const { content, questionKey, formation, questionnaireId } = verbatim;
      const isAutreKey = questionKey.includes("Autre");
      const formattedKey = questionKey.includes("Autre") ? questionKey.split("Autre")[0] : questionKey;

      const questionnaire = questionnaires.find((questionnaire) => questionnaire.id === questionnaireId).questionnaire;
      return {
        value: content,
        formation: formation,
        question: isAutreKey
          ? stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]) + " - Autre"
          : stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]),
        theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
      };
    })
    .filter(Boolean);
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
  verbatimsAnOrderedThemeAnswersMatcher,
  getFormattedReponsesByTemoignages,
  getFormattedReponsesByVerbatims,
};
