import {
  ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES,
  NEW_ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES,
  QUESTION_LABELS_BY_QUESTION_KEY,
  TROUVER_ENTREPRISE_LABEL_MATCHER,
  TROUVER_ENTREPRISE_OLD_TO_NEW_LABEL_MATCHER,
  VERBATIM_STATUS,
} from "../constants";
import type { GetAllWithFormationAndQuestionnaireResults } from "../dao/types/temoignages.types";
import type { GetAllWithFormationAndCampagneResult } from "../dao/types/verbatims.types";
import type { JsonArray, JsonObject, JsonValue } from "../db/schema";
import type { Formation, Questionnaire, Verbatim, VerbatimThemes } from "../types";

export const matchIdAndQuestions = (questionnaire: any) => {
  if (!questionnaire || !questionnaire.properties) {
    return null;
  }

  const questionnaireProperties = questionnaire.properties;
  const results: Record<string, string>[] = [];

  Object.keys(questionnaireProperties).forEach((category) => {
    const obj: Record<string, string> = {};
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

export const matchCardTypeAndQuestions = (questionnaire: any, questionnaireUI: any) => {
  if (!questionnaire || !questionnaire.properties) {
    return null;
  }
  const questionnaireProperties = questionnaire.properties;
  const results: Record<string, any>[] = [];

  Object.keys(questionnaireProperties).forEach((category) => {
    const obj: Record<string, any> = {};
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

export const getCategoriesWithEmojis = (questionnaire: any) => {
  if (!questionnaire || !questionnaire.properties) return [];
  return Object.entries(questionnaire.properties).map((property) => {
    const [key, content] = property;
    return {
      id: key,
      title: (content as { title: string }).title,
      emoji: (content as { emoji: string }).emoji,
      questionCount: Object.keys((content as { properties: Array<any> }).properties).length,
    };
  });
};

export const pieResponsesFormatting = (
  responses: string[]
): {
  name: string;
  value: number;
}[] =>
  responses.reduce(
    (
      acc: {
        name: string;
        value: number;
      }[],
      name: string
    ) => {
      if (name) {
        const index = acc.findIndex((item) => item.name === name);
        if (index !== -1) {
          acc[index].value++;
        } else {
          acc.push({ name, value: 1 });
        }
      }
      return acc;
    },
    []
  );

export const barResponsesFormatting = (responses: { label: string; value: number | string }[]) => {
  const emojiMapping = ["😫", "🧐", "😊", "😝"];

  const cleanedUpResponses = responses.filter(
    (
      response
    ): response is {
      label: string;
      value: number | string;
    } => response !== null && typeof response === "object" && "label" in response
  );

  const intermediate = cleanedUpResponses.reduce(
    (
      acc: {
        label: string;
        value: (number | string)[];
      }[],
      response
    ) => {
      const index = acc?.findIndex((item) => item.label === response.label);
      if (index === -1) {
        acc.push({ label: response.label, value: [response.value] });
      } else {
        acc[index].value = [...acc[index].value, response.value];
      }
      return acc;
    },
    []
  );

  const counts = intermediate.reduce((acc: Record<string, number[]>, response) => {
    response.value.forEach((val) => {
      const key = String(val);
      acc[key] = acc[key] || Array(intermediate.length).fill(0);
      acc[key][intermediate.indexOf(response)] += 1;
    });
    return acc;
  }, {});

  const data = Object.entries(counts).map(([key, value]) => ({
    [key]: value,
    emoji: emojiMapping[Number(key)],
  }));

  const questions = intermediate.map((response) => response.label);

  return { data, questions };
};

export const multiEmojiResponsesFormatting = (responses: { label: string; value: number | string }[]) => {
  const cleanedUpResponses = responses.filter(
    (
      response
    ): response is {
      label: string;
      value: number | string;
    } => response !== null && typeof response === "object" && "label" in response
  );

  const intermediate = cleanedUpResponses.reduce(
    (
      acc: {
        label: string;
        value: (number | string)[];
      }[],
      response
    ) => {
      const index = acc?.findIndex((item) => item.label === response.label);
      if (index === -1) {
        acc.push({ label: response.label, value: [response.value] });
      } else {
        acc[index].value = [...acc[index].value, response.value];
      }
      return acc;
    },
    []
  );

  const counts = intermediate.reduce((acc: Record<string, number[]>, response) => {
    response.value.forEach((val) => {
      const key = String(val);
      acc[key] = acc[key] || Array(intermediate.length).fill(0);
      acc[key][intermediate.indexOf(response)] += 1;
    });
    return acc;
  }, {});

  const data = Object.entries(counts).map(([key, value]) => ({
    [key]: value,
  }));

  const questions = intermediate.map((response) => response.label);

  return { data, questions };
};

export const verbatimsResponsesFormatting = (responses: { content: string; status: string }[]) => {
  const cleanedUpResponses = responses
    .map((response) => {
      if (
        response &&
        [VERBATIM_STATUS.VALIDATED, VERBATIM_STATUS.TO_FIX, VERBATIM_STATUS.GEM].includes(response.status)
      ) {
        return response;
      } else {
        return null;
      }
    })
    .filter(Boolean);

  return cleanedUpResponses;
};

export const getFormattedResponses = (
  responses: (string | number | boolean | JsonArray | JsonObject)[],
  widget: { type: string; mapping?: string[] }
) => {
  if (
    (widget.type === "pie" || widget.type === "emoji") &&
    Array.isArray(responses) &&
    typeof responses[0] === "string"
  ) {
    return pieResponsesFormatting(responses as string[]);
  }

  if (widget.type === "bar") {
    return barResponsesFormatting(responses as { label: string; value: number | string }[]);
  }

  if (widget.type === "multiEmoji") {
    const formattedTemoignages = responses
      .map((response) => {
        if (typeof response === "object" && "value" in response && "value" in response) {
          if (response.value === "Pas ok" || response.value === "Pas vraiment") {
            return { ...response, value: 0 };
          }
          if (response.value === "Moyen") {
            return { ...response, value: 1 };
          }
          if (response.value === "Oui" || response.value === "Bien") {
            return { ...response, value: 2 };
          }
        }
        return null;
      })
      .filter((response) => response !== null);
    return multiEmojiResponsesFormatting(formattedTemoignages as { label: string; value: number | string }[]);
  }

  if (widget.type === "text") {
    const cleanedUpResponses = responses.filter(
      (
        response
      ): response is {
        content: string;
        status: string;
      } => response !== null && typeof response === "object" && "content" in response && "status" in response
    );
    return verbatimsResponsesFormatting(cleanedUpResponses);
  }

  return null;
};

export const getReponseRating = (responses: Array<JsonValue>) => {
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
    const diffs: { key: keyof typeof roundedRates; diff: number }[] = [
      { key: "Mal", diff: rates.Mal - roundedRates.Mal },
      { key: "Moyen", diff: rates.Moyen - roundedRates.Moyen },
      { key: "Bien", diff: rates.Bien - roundedRates.Bien },
    ];

    // Sort by the largest difference
    diffs.sort((a, b) => b.diff - a.diff);

    // Adjust the largest difference
    roundedRates[diffs[0].key as keyof typeof roundedRates] += totalRounded > 100 ? -1 : 1;
  }

  return roundedRates;
};

export const commentVisTonExperienceEntrepriseLabelReconciler = (label: string): string | null => {
  if (!label) return null;
  const labelMap: { [key: string]: string } = {
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

export const getCommentVisTonExperienceEntrepriseOrder = (
  commentVisTonExperienceEntrepriseResults: {
    label: string;
    value: number | string;
  }[][]
) => {
  const valueMapString: Record<string, number> = {
    "Pas ok": 0,
    Moyen: 1,
    Bien: 2,
  };

  const valueMapNumber: Record<number, number> = {
    1: 0,
    2: 1,
    3: 2,
  };

  // Step 1: Create a map to store the total values for each label
  const labelTotals: Record<string, number> = {};

  commentVisTonExperienceEntrepriseResults.forEach((itemList) => {
    itemList?.forEach((item) => {
      const label = commentVisTonExperienceEntrepriseLabelReconciler(item.label);
      if (!label) return;
      const value = typeof item.value === "number" ? valueMapNumber[item.value] : valueMapString[item.value]; // needed to reconcile the different formats of the values coming from different questionnaire versions

      if (!labelTotals[label]) {
        labelTotals[label] = 0;
      }

      labelTotals[label] += value;
    });
  });

  // Step 2: Convert the map to an array of objects and sort them by total value
  const sortedLabels: {
    label: string;
    total: number;
  }[] = Object.keys(labelTotals)
    .map((label) => ({ label, total: labelTotals[label] }))
    .sort((a, b) => b.total - a.total);

  return sortedLabels;
};

export const getGemVerbatimsByWantedQuestionKey = (
  verbatims: (Pick<
    Verbatim,
    | "id"
    | "questionKey"
    | "content"
    | "createdAt"
    | "status"
    | "scores"
    | "temoignageId"
    | "themes"
    | "feedbackCount"
    | "deletedAt"
    | "updatedAt"
  > & {
    etablissementFormateurEntrepriseRaisonSociale?: string | null;
    etablissementFormateurEnseigne?: string | null;
    etablissementGestionnaireEnseigne?: string | null;
  })[]
) => {
  const questionKeyOrder = [
    "descriptionMetierConseil",
    "peurChangementConseil",
    "choseMarquanteConseil",
    "trouverEntrepriseConseil",
    "differenceCollegeCfaConseil",
  ];

  const groupedVerbatims: Record<string, any[]> = verbatims.reduce((acc: Record<string, any[]>, verbatim) => {
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
        questionLabel: QUESTION_LABELS_BY_QUESTION_KEY[questionKey as keyof typeof QUESTION_LABELS_BY_QUESTION_KEY],
        status: scores?.GEM.avis === "oui" ? VERBATIM_STATUS.GEM : status,
        etablissementFormateurEntrepriseRaisonSociale,
        etablissementFormateurEnseigne,
        etablissementGestionnaireEnseigne,
      });
    }
    return acc;
  }, {});

  return groupedVerbatims;
};

export const verbatimsAndOrderedThemeAnswersMatcher = (
  verbatims: (Pick<
    Verbatim,
    | "id"
    | "questionKey"
    | "content"
    | "createdAt"
    | "status"
    | "scores"
    | "temoignageId"
    | "themes"
    | "feedbackCount"
    | "deletedAt"
    | "updatedAt"
  > & {
    etablissementFormateurEntrepriseRaisonSociale?: string | null;
    etablissementFormateurEnseigne?: string | null;
    etablissementGestionnaireEnseigne?: string | null;
  })[],
  orderedThemeAnswers: {
    label: string;
    total: number;
  }[]
) => {
  const result = orderedThemeAnswers.map((item: { label: string; total: number }) => {
    const theme =
      ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES[item.label as keyof typeof ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES];

    if (theme === undefined) {
      return { ...item, verbatims: [] };
    }

    const verbatimsForTheme = verbatims
      .filter((verbatim) => verbatim && verbatim.themes && verbatim.themes[theme as keyof VerbatimThemes] === true)
      .map((verbatim) => ({
        id: verbatim.id,
        content: verbatim.content,
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

    return {
      ...(typeof item === "object" ? item : {}),
      label:
        NEW_ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES[
          item.label as keyof typeof NEW_ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES
        ],
      verbatims: verbatimsForTheme,
    };
  });

  return result;
};

export const getCategoryTitleFromResponseKey = (responseKey: string, questionnaire: any) => {
  for (const categoryKey in questionnaire.properties) {
    const category = questionnaire.properties[categoryKey];
    if (category.properties && category.properties[responseKey]) {
      return category.title;
    }
  }
  return null;
};

export const stripHtmlTags = (str: string) => {
  if (typeof str === "string") {
    return str.replace(/<\/?[^>]+(>|$)/g, "");
  }
  return str;
};

export const oldQuestionnaireValueMapping = (value: number | string) => {
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

export const getFormattedReponsesByTemoignages = (
  temoignages: GetAllWithFormationAndQuestionnaireResults,
  questionnaires: Questionnaire[]
) => {
  return temoignages
    .flatMap((temoignage) => {
      const { reponses, formation, questionnaireId, nomCampagne } = temoignage as {
        reponses: Record<string, any>;
        formation: Pick<
          Formation,
          | "intituleLong"
          | "localite"
          | "etablissementFormateurEnseigne"
          | "etablissementFormateurEntrepriseRaisonSociale"
          | "etablissementFormateurSiret"
        >;
        questionnaireId: string;
        nomCampagne: string | null;
      };

      const questionnaire = questionnaires.find((questionnaire) => questionnaire.id === questionnaireId)?.questionnaire;

      if (!reponses || !questionnaire) {
        return [];
      }

      return Object.keys(reponses).flatMap((key) => {
        const isAutreKey = key.includes("Autre");
        const formattedKey = key.includes("Autre") ? key.split("Autre")[0] : key;
        const matchedIdAndQuestionKey = matchIdAndQuestions(questionnaire)?.[formattedKey];

        if (!matchedIdAndQuestionKey) {
          return [];
        }

        if (typeof reponses[key] === "string") {
          return {
            value: oldQuestionnaireValueMapping(stripHtmlTags(reponses[key])),
            formation: formation,
            question: isAutreKey
              ? stripHtmlTags(matchedIdAndQuestionKey) + " - Autre"
              : stripHtmlTags(matchedIdAndQuestionKey),
            theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
            nomCampagne,
          };
        }
        if (Array.isArray(reponses[key]) && typeof reponses[key][0] === "string") {
          return reponses[key].map((response) => ({
            value: oldQuestionnaireValueMapping(stripHtmlTags(response)),
            formation: formation,
            question: isAutreKey
              ? stripHtmlTags(matchedIdAndQuestionKey) + " - Autre"
              : stripHtmlTags(matchedIdAndQuestionKey),
            theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
            nomCampagne,
          }));
        }
        if (Array.isArray(reponses[key]) && typeof reponses[key][0] === "object") {
          return reponses[key].map((response) => ({
            value: oldQuestionnaireValueMapping(stripHtmlTags(response.value)),
            formation: formation,
            question: stripHtmlTags(`${matchedIdAndQuestionKey} - ${response.label}`),
            theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
            nomCampagne,
          }));
        }
        return [];
      });
    })
    .filter(Boolean);
};

export const getFormattedReponsesByVerbatims = (
  verbatims: GetAllWithFormationAndCampagneResult,
  questionnaires: Questionnaire[]
) => {
  if (!verbatims || !questionnaires.length) return [];

  return verbatims
    .map((verbatim) => {
      const { content, questionKey, formation, questionnaireId, status, nomCampagne } = verbatim;
      const isAutreKey = questionKey.includes("Autre");
      const formattedKey = questionKey.includes("Autre") ? questionKey.split("Autre")[0] : questionKey;

      const questionnaire = questionnaires.find((questionnaire) => questionnaire.id === questionnaireId)?.questionnaire;

      if (!questionnaire) {
        return null;
      }

      const matchedIdAndQuestionKey = matchIdAndQuestions(questionnaire);

      if (!matchedIdAndQuestionKey) {
        return null;
      }

      return {
        value: content,
        formation: formation,
        question:
          isAutreKey && questionnaire && matchedIdAndQuestionKey
            ? stripHtmlTags(matchedIdAndQuestionKey[formattedKey]) + " - Autre"
            : stripHtmlTags(matchedIdAndQuestionKey[formattedKey]),
        theme: getCategoryTitleFromResponseKey(formattedKey, questionnaire),
        status: status,
        nomCampagne,
      };
    })
    .filter(Boolean);
};

export const getCommentVisTonExperienceEntrepriseRating = (
  commentVisTonExperienceEntrepriseResults: { label: string; value: string | number }[][]
) => {
  if (!commentVisTonExperienceEntrepriseResults || !Array.isArray(commentVisTonExperienceEntrepriseResults)) return [];

  const flattened = commentVisTonExperienceEntrepriseResults.flat().map((item) => ({
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
      label: label
        ? NEW_ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES[
            label as keyof typeof NEW_ANSWER_LABELS_TO_FORMATION_VERBATIM_THEMES
          ]
        : label,
      results: values.reduce((acc: Record<string, { count: number; percentage: number }>, value, index) => {
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

export const getTrouverEntrepriseRating = (
  cfaAideTrouverEntreprise: (JsonValue | undefined)[],
  commentTrouverEntreprise: (JsonValue | undefined)[]
) => {
  const helpedFromCfa = cfaAideTrouverEntreprise.filter(
    (response) => response === "Oui j’ai eu besoin de lui et il m’a aidé"
  );

  const mergedAndFlattenReponses = [...helpedFromCfa, ...commentTrouverEntreprise].flat();

  //reconcile old and new questionnaire values
  const reconciledValues = mergedAndFlattenReponses.map((value) => {
    value =
      TROUVER_ENTREPRISE_OLD_TO_NEW_LABEL_MATCHER[value as keyof typeof TROUVER_ENTREPRISE_OLD_TO_NEW_LABEL_MATCHER] ||
      value;
    return value;
  });

  const occurrences: Record<string, number> = reconciledValues.reduce(
    (acc: Record<string, number>, value) => {
      if (typeof value === "string") {
        acc[value] = (acc[value] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const total = mergedAndFlattenReponses.length;

  let result = Object.entries(occurrences).map(([key, count]) => ({
    label: TROUVER_ENTREPRISE_LABEL_MATCHER[key as keyof typeof TROUVER_ENTREPRISE_LABEL_MATCHER] || key,
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
