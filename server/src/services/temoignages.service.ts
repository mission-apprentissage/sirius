// @ts-nocheck -- TODO

import {
  ANSWER_LABELS_TO_ETABLISSEMENT_VERBATIM_THEMES,
  UNCOMPLIANT_TEMOIGNAGE_TYPE,
  VERBATIM_STATUS,
} from "../constants";
import * as campagnesDao from "../dao/campagnes.dao";
import * as formationsDao from "../dao/formations.dao";
import * as questionnairesDao from "../dao/questionnaires.dao";
import * as temoignagesDao from "../dao/temoignages.dao";
import * as verbatimsDao from "../dao/verbatims.dao";
import { ErrorMessage } from "../errors";
import * as xlsxExport from "../modules/xlsxExport";
import { intituleFormationFormatter } from "../utils/formations.utils";
import {
  getCategoriesWithEmojis,
  getCommentVisTonExperienceEntrepriseOrder,
  getCommentVisTonExperienceEntrepriseRating,
  getFormattedReponsesByTemoignages,
  getFormattedReponsesByVerbatims,
  getFormattedResponses,
  getGemVerbatimsByWantedQuestionKey,
  getReponseRating,
  matchCardTypeAndQuestions,
  matchIdAndQuestions,
  verbatimsAnOrderedThemeAnswersMatcher,
} from "../utils/temoignages.utils";
import { getChampsLibreField } from "../utils/verbatims.utils";

export const createTemoignage = async (temoignage) => {
  try {
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(temoignage.campagneId);

    if (!campagne) throw new Error("Campagne not found");

    const temoignageCount = await temoignagesDao.countByCampagne(temoignage.campagneId);

    if (new Date(campagne.startDate) > new Date()) {
      return { success: false, body: ErrorMessage.CampagneNotStarted };
    }
    if (new Date(campagne.endDate) < new Date()) {
      return { success: false, body: ErrorMessage.CampagneEnded };
    }
    if (campagne.seats && temoignageCount >= campagne.seats) {
      return { success: false, body: ErrorMessage.NoSeatsAvailable };
    }

    const createdTemoignage = await temoignagesDao.create(temoignage);

    return { success: true, body: createdTemoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getTemoignages = async (campagneIds) => {
  try {
    const query = { campagneIds };
    const temoignages = await temoignagesDao.findAllWithVerbatims(query);
    for (const temoignage of temoignages) {
      const campagne = await campagnesDao.getOne(temoignage.campagneId);

      if (!campagne) {
        return { success: false, body: ErrorMessage.CampagneNotFoundError };
      }
      const questionnaire = await questionnairesDao.getOne(campagne.questionnaireId);

      if (!questionnaire) {
        return { success: false, body: ErrorMessage.QuestionnaireNotFoundError };
      }
      const verbatimsFields = getChampsLibreField(questionnaire.questionnaireUI);

      for (const key of verbatimsFields) {
        if (
          temoignage.reponses[key] &&
          temoignage.reponses[key].status !== VERBATIM_STATUS.VALIDATED &&
          temoignage.reponses[key].status !== VERBATIM_STATUS.TO_FIX &&
          temoignage.reponses[key].status !== VERBATIM_STATUS.GEM
        ) {
          delete temoignage.reponses[key];
        }
      }
    }

    return { success: true, body: temoignages };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const deleteTemoignage = async (id) => {
  try {
    const temoignage = await temoignagesDao.deleteOne(id);
    return { success: true, body: temoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const updateTemoignage = async (id, updatedTemoignage) => {
  try {
    const temoignage = await temoignagesDao.update(id, updatedTemoignage);

    return { success: true, body: temoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getDatavisualisation = async (campagneIds = []) => {
  try {
    const query = { campagneIds };
    const temoignages = await temoignagesDao.findAllWithVerbatims(query);
    const allQuestionnaires = await questionnairesDao.findAll();

    const campagnes = await campagnesDao.getAll(campagneIds);

    const questionnaireTemoignagesMap = {};

    // ajoute les témoignages à leur questionnaire respectif
    for (const temoignage of temoignages) {
      temoignage.verbatims.forEach(
        (verbatim) =>
          (temoignage.reponses[verbatim.questionKey] = { content: verbatim.content, status: verbatim.status })
      );

      const campagne = campagnes.filter((campagne) => campagne.id === temoignage.campagneId)[0];
      if (!campagne) {
        return { success: false, body: ErrorMessage.CampagneNotFoundError };
      }

      const questionnaireId = campagne.questionnaireId;
      if (!questionnaireTemoignagesMap[questionnaireId]) {
        questionnaireTemoignagesMap[questionnaireId] = [];
      }

      questionnaireTemoignagesMap[questionnaireId].push(temoignage);
    }

    // crée un objet avec les catégories et les questions pour chaque questionnaire
    const result = Object.keys(questionnaireTemoignagesMap).map((questionnaireId) => {
      const questionnaireById = allQuestionnaires.find((questionnaire) => questionnaire.id === questionnaireId);

      const matchedIdAndQuestions = matchIdAndQuestions(questionnaireById.questionnaire);
      const matchedCardTypeAndQuestions = matchCardTypeAndQuestions(
        questionnaireById.questionnaire,
        questionnaireById.questionnaireUi
      );
      const categories = getCategoriesWithEmojis(questionnaireById.questionnaire);

      categories.forEach((category) => {
        category.questionsList = Object.keys(questionnaireById.questionnaire.properties[category.id].properties).map(
          (questionId) => {
            const label = matchedIdAndQuestions[questionId];
            const widget =
              typeof matchedCardTypeAndQuestions[questionId] === "string"
                ? { type: matchedCardTypeAndQuestions[questionId] }
                : matchedCardTypeAndQuestions[questionId];

            const responses = questionnaireTemoignagesMap[questionnaireById.id]
              .map((temoignage) => temoignage.reponses[questionId])
              .flat()
              .filter(Boolean);

            const formattedResponses = getFormattedResponses(responses, widget);

            return {
              id: questionId,
              label,
              widget,
              responses: formattedResponses,
            };
          }
        );
      });

      return {
        questionnaireId: questionnaireById.id,
        questionnaireName: questionnaireById.nom,
        categories: categories,
        temoignageCount: questionnaireTemoignagesMap[questionnaireId].length,
      };
    });

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getDatavisualisationFormation = async (intituleFormation, cfd, idCertifinfo, slug) => {
  try {
    const formattedIntituleFormation = intituleFormation ? intituleFormationFormatter(intituleFormation) : null;

    const campagneIds = (
      await formationsDao.findFormationByIntituleCfdIdCertifInfoOrSlug(
        formattedIntituleFormation,
        cfd,
        idCertifinfo,
        slug
      )
    ).map((formation) => formation.campagneId);

    if (!campagneIds.length) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const query = { campagneIds };
    const temoignages = await temoignagesDao.findAll(query);

    if (!temoignages.length) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const commentVisTonExperienceEntreprise = temoignages
      .map((temoignage) => temoignage.reponses["commentVisTonExperienceEntreprise"])
      .filter(Boolean);

    const commentVisTonExperienceEntrepriseRating = getCommentVisTonExperienceEntrepriseRating(
      commentVisTonExperienceEntreprise
    );

    const commentVisTonEntrepriseOrder = getCommentVisTonExperienceEntrepriseOrder(commentVisTonExperienceEntreprise);

    const commentVisTonEntrepriseVerbatimsQuery = {
      temoignageIds: temoignages.map((temoignage) => temoignage.id),
      status: [VERBATIM_STATUS.GEM],
    };
    const verbatimsByThemesResults = await verbatimsDao.getAll(commentVisTonEntrepriseVerbatimsQuery);

    const verbatimsByThemesWithEtablissement = verbatimsByThemesResults.map((verbatim) => {
      const relatedTemoignage = temoignages.find((temoignage) => temoignage.id === verbatim.temoignageId);
      return {
        ...verbatim,
        etablissementFormateurEntrepriseRaisonSociale: relatedTemoignage.etablissementFormateurEntrepriseRaisonSociale,
        etablissementFormateurEnseigne: relatedTemoignage.etablissementFormateurEnseigne,
        etablissementGestionnaireEnseigne: relatedTemoignage.etablissementGestionnaireEnseigne,
      };
    });

    const matchedVerbatimAndThemes = verbatimsAnOrderedThemeAnswersMatcher(
      verbatimsByThemesWithEtablissement,
      commentVisTonEntrepriseOrder
    );

    const gemsQuery = {
      temoignageIds: temoignages.map((temoignage) => temoignage.id),
      status: [VERBATIM_STATUS.GEM],
      questionKey: [
        "descriptionMetierConseil",
        "peurChangementConseil",
        "choseMarquanteConseil",
        "trouverEntrepriseConseil",
        "differenceCollegeCfaConseil",
      ],
    };

    const gemsResults = await verbatimsDao.getAll(gemsQuery);

    const gemWithEtablissement = gemsResults.splice(0, 10).map((verbatim) => {
      const relatedTemoignage = temoignages.find((temoignage) => temoignage.id === verbatim.temoignageId);
      return {
        ...verbatim,
        etablissementFormateurEntrepriseRaisonSociale: relatedTemoignage.etablissementFormateurEntrepriseRaisonSociale,
        etablissementFormateurEnseigne: relatedTemoignage.etablissementFormateurEnseigne,
        etablissementGestionnaireEnseigne: relatedTemoignage.etablissementGestionnaireEnseigne,
      };
    });

    const gems = getGemVerbatimsByWantedQuestionKey(gemWithEtablissement);

    const etablissementsCount = temoignages.reduce((acc, temoignage) => {
      if (temoignage.etablissementFormateurEntrepriseRaisonSociale) {
        acc[temoignage.etablissementFormateurEntrepriseRaisonSociale] =
          (acc[temoignage.etablissementFormateurEntrepriseRaisonSociale] || 0) + 1;
      }
      return acc;
    }, {});

    const countOfDifferentEtablissements = Object.keys(etablissementsCount).length;

    const result = {
      etablissementsCount: countOfDifferentEtablissements,
      temoignagesCount: temoignages.length,
      verbatimsByThemes: matchedVerbatimAndThemes,
      gems,
      commentVisTonExperienceEntrepriseRating,
    };

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getDatavisualisationEtablissement = async (uai) => {
  try {
    const campagneIds = (await formationsDao.findFormationByUai(uai)).map((formation) => formation.campagneId);

    if (!campagneIds.length) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const query = { campagneIds };
    const temoignages = await temoignagesDao.findAll(query);

    if (!temoignages.length) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const commentCaSePasseCfa = temoignages.map((temoignage) => temoignage.reponses["commentCaSePasseCfa"]);
    const commentCaSePasseCfaRates = getReponseRating(commentCaSePasseCfa);

    const commentVisTonExperienceCfa = temoignages.map(
      (temoignage) => temoignage.reponses["commentVisTonExperienceCfa"]
    );

    const commentVisTonExperienceCfaOrder = getCommentVisTonExperienceEntrepriseOrder(commentVisTonExperienceCfa); // change name if working for CFA
    const commentVisTonCfaVerbatimsQuery = {
      temoignageIds: temoignages.map((temoignage) => temoignage.id),
      status: [VERBATIM_STATUS.GEM, VERBATIM_STATUS.VALIDATED],
    };
    const commentVisTonCfaVerbatimsResults = await verbatimsDao.getAll(commentVisTonCfaVerbatimsQuery);

    // check if working for cfa
    const matchedVerbatimAndcommentVisTonCfa = verbatimsAnOrderedThemeAnswersMatcher(
      commentVisTonCfaVerbatimsResults,
      commentVisTonExperienceCfaOrder,
      ANSWER_LABELS_TO_ETABLISSEMENT_VERBATIM_THEMES
    );

    const accompagneCfa = temoignages.map((temoignage) => temoignage.reponses["sensTuAccompagneAuCfa"]);
    const formattedAccompagneCfa = accompagneCfa.map((answer) => {
      if (answer === "Oui, ils sont disponibles tout en nous laissant beaucoup en autonomie") {
        return "Bien";
      }
      if (answer === "Moyen, on communique peu avec les équipes et les formateurs") {
        return "Moyen";
      }
      if (answer === "Non l'équipe n'est pas à l'écoute de nos besoins") {
        return "Mal";
      }
      return null;
    });

    const accompagneCfaRates = getReponseRating(formattedAccompagneCfa);

    const verbatimsQuery = {
      temoignageIds: temoignages.map((temoignage) => temoignage.id),
      status: [VERBATIM_STATUS.GEM],
      questionKey: [
        "descriptionMetierConseil",
        "peurChangementConseil",
        "choseMarquanteConseil",
        "trouverEntrepriseConseil",
      ],
    };

    const verbatimsResults = await verbatimsDao.getAll(verbatimsQuery);

    const displayedGems = getGemVerbatimsByWantedQuestionKey(verbatimsResults);

    const result = {
      temoignagesCount: temoignages.length,
      commentCaSePasseCfaRates,
      commentVisTonCfa: matchedVerbatimAndcommentVisTonCfa,
      displayedGems,
      accompagneCfaRates,
    };

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getUncompliantTemoignages = async ({
  type,
  duration,
  answeredQuestions,
  includeUnavailableDuration,
  page,
  pageSize,
}) => {
  const uncompliantsQuery = {
    isBot: true,
    incompleteNumber: answeredQuestions,
    timeToRespondLimit: 1000 * 60 * duration,
    includeUnavailableDuration,
  };

  let temoignages = [];
  try {
    const uncompliantsCount = await temoignagesDao.uncompliantsCount(uncompliantsQuery);
    let totalItemsCountPerType = 0;

    if (type === UNCOMPLIANT_TEMOIGNAGE_TYPE.BOT) {
      temoignages = await temoignagesDao.getAllTemoignagesWithFormation({ isBot: true }, page, pageSize);
      totalItemsCountPerType = uncompliantsCount.botCount;
    }
    if (type === UNCOMPLIANT_TEMOIGNAGE_TYPE.INCOMPLETE) {
      temoignages = await temoignagesDao.getAllTemoignagesWithFormation(
        { incompleteNumber: answeredQuestions },
        page,
        pageSize
      );
      totalItemsCountPerType = uncompliantsCount.incompleteCount;
    }
    if (type === UNCOMPLIANT_TEMOIGNAGE_TYPE.QUICK) {
      temoignages = await temoignagesDao.getAllTemoignagesWithFormation(
        { timeToRespondLimit: 1000 * 60 * duration },
        page,
        pageSize
      );
      totalItemsCountPerType = uncompliantsCount.quickCount;
    }
    if (type === UNCOMPLIANT_TEMOIGNAGE_TYPE.ALL) {
      temoignages = await temoignagesDao.getAllTemoignagesWithFormation(uncompliantsQuery, page, pageSize);
      totalItemsCountPerType =
        uncompliantsCount.botCount + uncompliantsCount.incompleteCount + uncompliantsCount.quickCount;
    }

    return {
      success: true,
      body: temoignages.rows,
      count: {
        total: uncompliantsCount.botCount + uncompliantsCount.incompleteCount + uncompliantsCount.quickCount,
        ...uncompliantsCount,
      },
      pagination: {
        totalItemsCountPerType,
        currentPage: parseInt(page),
        pageSize: pageSize,
        totalPages: Math.ceil(totalItemsCountPerType / pageSize),
        hasMore: temoignages.hasNextPage || false,
      },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const deleteMultipleTemoignages = async (temoignagesIds) => {
  try {
    const temoignages = await temoignagesDao.deleteMultiple(temoignagesIds);
    return { success: true, body: temoignages };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const exportTemoignagesToXlsx = async (campagneIds, res) => {
  try {
    const questionnaires = await questionnairesDao.findAll();
    const temoignages = await temoignagesDao.getAllWithFormationAndQuestionnaire(campagneIds);

    const temoignagesIds = temoignages.map((temoignage) => temoignage.id);
    const moderatedVerbatimStatus = [VERBATIM_STATUS.VALIDATED, VERBATIM_STATUS.TO_FIX, VERBATIM_STATUS.GEM];

    const verbatims = await verbatimsDao.getAllWithFormationAndCampagne(temoignagesIds, moderatedVerbatimStatus);

    const formattedTemoignages = getFormattedReponsesByTemoignages(temoignages, questionnaires);
    const formattedVerbatims = getFormattedReponsesByVerbatims(verbatims, questionnaires);

    await xlsxExport.generateTemoignagesXlsx(formattedTemoignages, formattedVerbatims, res);
  } catch (_error) {
    throw new Error("Error fetching data or generating Excel");
  }
};
