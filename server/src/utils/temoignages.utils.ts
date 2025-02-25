// @ts-nocheck -- TODO

import {
  ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES,
  NEW_ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES,
  QUESTION_LABELS_BY_QUESTION_KEY,
  QUESTION_LABELS_BY_QUESTION_KEY,
  TROUVER_ENTREPRISE_LABEL_MATCHER,
  TROUVER_ENTREPRISE_OLD_TO_NEW_LABEL_MATCHER,
  VERBATIM_STATUS,
} from "../constants";

export const matchIdAndQuestions = (questionnaire) => {
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

export const matchCardTypeAndQuestions = (questionnaire, questionnaireUI) => {
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

export const pieResponsesFormatting = (responses) =>
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

export const barResponsesFormatting = (responses) => {
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

export const multiEmojiResponsesFormatting = (responses) => {
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

export const verbatimsResponsesFormatting = (responses) => {
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

export const getFormattedResponses = (temoignages, widget) => {
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

export const appendFormationDataWhenEmpty = (campagne) => {
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

export const getReponseRating = (responses) => {
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

export const commentVisTonExperienceEntrepriseLabelReconciler = (label) => {
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

export const getCommentVisTonExperienceEntrepriseOrder = (commentVisTonExperienceEntrepriseResults) => {
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

export const getGemVerbatimsByWantedQuestionKey = (verbatims) => {
  const questionKeyOrder = [
    "descriptionMetierConseil",
    "peurChangementConseil",
    "choseMarquanteConseil",
    "trouverEntrepriseConseil",
    "differenceCollegeCfaConseil",
  ];

  const groupedVerbatims = verbatims.reduce((acc, verbatim) => {
    const {
      id,
      questionKey,
      content,
      createdAt,
      etablissementFormateurEntrepriseRaisonSociale,
      etablissementFormateurEnseigne,
      etablissementGestionnaireEnseigne,
      status,
      scores,
    } = verbatim;

    if (questionKeyOrder.includes(questionKey)) {
      acc[questionKey] = acc[questionKey] || [];
      acc[questionKey].push({
        id,
        content,
        createdAt,
        questionLabel: QUESTION_LABELS_BY_QUESTION_KEY[questionKey],
        status: scores.GEM.avis === "Oui" ? VERBATIM_STATUS.GEM : status,
        etablissementFormateurEntrepriseRaisonSociale,
        etablissementFormateurEnseigne,
        etablissementGestionnaireEnseigne,
      });
    }
    return acc;
  }, {});

  return groupedVerbatims;
};

export const verbatimsAnOrderedThemeAnswersMatcher = (verbatims, orderedThemeAnswers) => {
  const result = orderedThemeAnswers.map((item) => {
    const theme = ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES[item.label];

    if (theme === undefined) {
      return { ...item, verbatims: [] };
    }

    // needed because of camelCase to snake_case conversion from kysely plugin
    verbatims.forEach((verbatim) => {
      if (verbatim?.themes) {
        verbatim.themes.CHARGE_TRAVAIL = verbatim.themes.CHARGETRAVAIL;
        verbatim.themes.MOINS_VACANCES = verbatim.themes.MOINSVACANCES;
        verbatim.themes.DIFFICULTES_COURS = verbatim.themes.DIFFICULTESCOURS;
        verbatim.themes.APPRENTISSAGE_METIER = verbatim.themes.APPRENTISSAGEMETIER;
        verbatim.themes.ENSEIGNEMENT_PROPOSE = verbatim.themes.ENSEIGNEMENTPROPOSE;
        verbatim.themes.INTEGRATION_AMBIANCE = verbatim.themes.INTEGRATIONAMBIANCE;
        verbatim.themes.ACCESSIBILITE_HANDICAP = verbatim.themes.ACCESSIBILITEHANDICAP;
        verbatim.themes.JOURNEE_TYPE_ENTREPRISE = verbatim.themes.JOURNEETYPEENTREPRISE;
        verbatim.themes.JOURNEE_TYPE_ETABLISSEMENT = verbatim.themes.JOURNEETYPEETABLISSEMENT;
        verbatim.themes.RYTHME_PERSONNEL_ETABLISSEMENT = verbatim.themes.RYTHMEPERSONNELETABLISSEMENT;
        verbatim.themes.RYTHME_ENTREPRISE_ETABLISSEMENT = verbatim.themes.RYTHMEENTREPRISEETABLISSEMENT;
      }
    });

    const verbatimsForTheme = verbatims
      .filter((verbatim) => verbatim && verbatim.themes && verbatim.themes[theme] === true)
      .map((verbatim) => ({
        id: verbatim.id,
        content: verbatim.content,
        questionLabel: QUESTION_LABELS_BY_QUESTION_KEY[item.questionKey],
        status: verbatim.status,
        createdAt: verbatim.createdAt,
        etablissementFormateurEntrepriseRaisonSociale: verbatim.etablissementFormateurEntrepriseRaisonSociale,
        etablissementFormateurEnseigne: verbatim.etablissementFormateurEnseigne,
        etablissementGestionnaireEnseigne: verbatim.etablissementGestionnaireEnseigne,
      }))
      .sort((a, b) => {
        if (a.status.includes(VERBATIM_STATUS.GEM) && !b.status.includes(VERBATIM_STATUS.GEM)) {
          return -1;
        } else if (!a.status.includes(VERBATIM_STATUS.GEM) && b.status.includes(VERBATIM_STATUS.GEM)) {
          return 1;
        }
        return 0;
      });

    return { ...item, label: NEW_ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES[item.label], verbatims: verbatimsForTheme };
  });

  return result;
};

export const getCategoryTitleFromResponseKey = (responseKey, questionnaire) => {
  for (const categoryKey in questionnaire.properties) {
    const category = questionnaire.properties[categoryKey];
    if (category.properties && category.properties[responseKey]) {
      return category.title;
    }
  }
  return null;
};

export const stripHtmlTags = (str) => {
  if (typeof str === "string") {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  }
  return str;
};

export const oldQuestionnaireValueMapping = (value) => {
  if (value == 0) {
    return "Pas ok";
  }
  if (value == 1) {
    return "Moyen";
  }
  if (value == 2 || value == 3) {
    return "Bien";
  }

  return value;
};

export const getFormattedReponsesByTemoignages = (temoignages, questionnaires) => {
  return temoignages
    .flatMap((temoignage) => {
      const { reponses, formation, questionnaireId } = temoignage;
      const questionnaire = questionnaires.find((questionnaire) => questionnaire.id === questionnaireId).questionnaire;

      return Object.keys(reponses).flatMap((key) => {
        const isAutreKey = key.includes("Autre");
        const formattedKey = key.includes("Autre") ? key.split("Autre")[0] : key;

        if (typeof reponses[key] === "string") {
          return {
            value: oldQuestionnaireValueMapping(stripHtmlTags(reponses[key])),
            formation: formation,
            question: isAutreKey
              ? stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]) + " - Autre"
              : stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]),
            theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
          };
        }
        if (Array.isArray(reponses[key]) && typeof reponses[key][0] === "string") {
          return reponses[key].map((response) => ({
            value: oldQuestionnaireValueMapping(stripHtmlTags(response)),
            formation: formation,
            question: isAutreKey
              ? stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]) + " - Autre"
              : stripHtmlTags(matchIdAndQuestions(questionnaire)[formattedKey]),
            theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
          }));
        }
        if (Array.isArray(reponses[key]) && typeof reponses[key][0] === "object") {
          return reponses[key].map((response) => ({
            value: oldQuestionnaireValueMapping(stripHtmlTags(response.value)),
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

export const getFormattedReponsesByVerbatims = (verbatims, questionnaires) => {
  return verbatims
    .map((verbatim) => {
      const { content, questionKey, formation, questionnaireId, status } = verbatim;
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
        status: status,
      };
    })
    .filter(Boolean);
};

export const getCommentVisTonExperienceEntrepriseRating = (commentVisTonExperienceEntrepriseResults) => {
  const flattened = commentVisTonExperienceEntrepriseResults.flat().map((item) => ({
    ...item,
    label: commentVisTonExperienceEntrepriseLabelReconciler(item.label),
    value: oldQuestionnaireValueMapping(item.value),
  }));

  const labels = [...new Set(flattened.map((item) => item.label))];
  const values = ["Bien", "Moyen", "Pas ok"];

  const result = labels.map((label) => {
    const totalResponses = flattened.filter((item) => item.label === label).length;
    const rawCounts = values.map(
      (value) => flattened.filter((item) => item.label === label && item.value === value).length
    );

    const percentages = rawCounts.map((count) => (count / totalResponses) * 100);

    const roundedPercentages = percentages.map((p) => Math.round(p));
    const totalRounded = roundedPercentages.reduce((sum, p) => sum + p, 0);

    if (totalRounded !== 100) {
      const diff = 100 - totalRounded;
      const indexToAdjust = roundedPercentages.indexOf(Math.max(...roundedPercentages));
      roundedPercentages[indexToAdjust] += diff;
    }

    return {
      label: NEW_ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES[label],
      results: values.reduce((acc, value, index) => {
        acc[value] = {
          count: rawCounts[index],
          percentage: roundedPercentages[index],
        };
        return acc;
      }, {}),
    };
  });

  return result;
};

export const getTrouverEntrepriseRating = (cfaAideTrouverEntreprise, commentTrouverEntreprise) => {
  const helpedFromCfa = cfaAideTrouverEntreprise.filter(
    (response) => response === "Oui j’ai eu besoin de lui et il m’a aidé"
  );

  const mergedAndFlattenReponses = [...helpedFromCfa, ...commentTrouverEntreprise].flat();

  //reconcile old and new questionnaire values
  const reconciledValues = mergedAndFlattenReponses.map((value) => {
    value = TROUVER_ENTREPRISE_OLD_TO_NEW_LABEL_MATCHER[value] || value;
    return value;
  });

  const occurrences = reconciledValues.reduce((acc, str) => {
    acc[str] = (acc[str] || 0) + 1;
    return acc;
  }, {});

  const total = mergedAndFlattenReponses.length;

  let result = Object.entries(occurrences).map(([key, count]) => ({
    label: TROUVER_ENTREPRISE_LABEL_MATCHER[key] || key,
    count,
    percentage: (count / total) * 100,
  }));

  result = result
    .sort((a, b) => b.percentage - a.percentage)
    .map((item) => {
      item.percentage = Math.round(item.percentage);
      return item;
    });

  const roundedTotal = result.reduce((sum, item) => sum + item.percentage, 0);
  let diff = 100 - roundedTotal;

  for (let i = 0; diff !== 0; i++) {
    result[i % result.length].percentage += diff > 0 ? 1 : -1;
    diff += diff > 0 ? -1 : 1;
  }

  return result;
};
