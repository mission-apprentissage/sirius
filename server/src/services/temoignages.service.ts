import type { Response } from "express";

import { UNCOMPLIANT_TEMOIGNAGE_TYPE, VERBATIM_STATUS } from "../constants";
import * as campagnesDao from "../dao/campagnes.dao";
import * as formationsDao from "../dao/formations.dao";
import * as questionnairesDao from "../dao/questionnaires.dao";
import * as temoignagesDao from "../dao/temoignages.dao";
import * as verbatimsDao from "../dao/verbatims.dao";
import type { JsonValue } from "../db/schema";
import { ErrorMessage } from "../errors";
import * as xlsxExport from "../modules/xlsxExport";
import type { Temoignage, TemoignageCreation, TemoignageUpdate } from "../types";
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
  getTrouverEntrepriseRating,
  matchCardTypeAndQuestions,
  matchIdAndQuestions,
  verbatimsAnOrderedThemeAnswersMatcher,
} from "../utils/temoignages.utils";

export const createTemoignage = async (temoignage: TemoignageCreation) => {
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

export const updateTemoignage = async (id: string, updatedTemoignage: TemoignageUpdate) => {
  try {
    const temoignage = await temoignagesDao.update(id, updatedTemoignage);

    return { success: true, body: temoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getDatavisualisation = async (campagneIds: string[] = []) => {
  try {
    const query = { campagneIds };
    const temoignages = await temoignagesDao.findAllWithVerbatims(query);

    if (!temoignages.length) {
      return { success: true, body: [] };
    }

    const allQuestionnaires = await questionnairesDao.findAll();

    if (!allQuestionnaires?.length) {
      return { success: false, body: ErrorMessage.QuestionnaireNotFoundError };
    }

    const campagnes = await campagnesDao.getAll(campagneIds);

    if (!campagnes.length) {
      return { success: false, body: ErrorMessage.CampagneNotFoundError };
    }

    const questionnaireTemoignagesMap: Record<string, Temoignage[]> = {};

    // ajoute les témoignages à leur questionnaire respectif
    for (const temoignage of temoignages) {
      if (!temoignage.reponses) {
        temoignage.reponses = {};
      }
      temoignage.verbatims.forEach((verbatim) => {
        if (temoignage.reponses && typeof temoignage.reponses === "object") {
          (temoignage.reponses as Record<string, JsonValue | null>)[verbatim.questionKey] = {
            content: verbatim.content,
            status: verbatim.status,
          };
        }
      });

      const campagne = campagnes.filter((campagne) => campagne.id === temoignage.campagneId)[0];
      if (!campagne) {
        return { success: false, body: ErrorMessage.CampagneNotFoundError };
      }

      const questionnaireId = campagne.questionnaireId;

      if (questionnaireId) {
        if (!questionnaireTemoignagesMap[questionnaireId]) {
          questionnaireTemoignagesMap[questionnaireId] = [];
        }
        questionnaireTemoignagesMap[questionnaireId].push(temoignage);
      }
    }

    // crée un objet avec les catégories et les questions pour chaque questionnaire
    const result = Object.keys(questionnaireTemoignagesMap).map((questionnaireId) => {
      const questionnaireById = allQuestionnaires.find((questionnaire) => questionnaire.id === questionnaireId);

      if (!questionnaireById) {
        return null;
      }

      const matchedIdAndQuestions = matchIdAndQuestions(questionnaireById.questionnaire);
      const matchedCardTypeAndQuestions = matchCardTypeAndQuestions(
        questionnaireById.questionnaire,
        questionnaireById.questionnaireUi
      );
      const categories = getCategoriesWithEmojis(questionnaireById.questionnaire).map((category) => ({
        ...category,
        questionsList: Object.keys(questionnaireById.questionnaire.properties[category.id].properties).map(
          (questionId) => {
            const label = matchedIdAndQuestions[questionId];
            const widget =
              typeof matchedCardTypeAndQuestions[questionId] === "string"
                ? { type: matchedCardTypeAndQuestions[questionId] }
                : matchedCardTypeAndQuestions[questionId];

            const responses = questionnaireTemoignagesMap[questionnaireById.id]
              .map((temoignage) =>
                temoignage.reponses ? (temoignage.reponses as Record<string, JsonValue | null>)[questionId] : null
              )
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
        ),
      }));

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

export const getDatavisualisationFormation = async (
  intituleFormation: string | null,
  cfd: string | null,
  idCertifinfo: string | null,
  slug: string | null
) => {
  try {
    const formattedIntituleFormation = intituleFormation ? intituleFormationFormatter(intituleFormation) : null;

    const formationsWithCampagnes = await formationsDao.findFormationByIntituleCfdIdCertifInfoOrSlug(
      formattedIntituleFormation,
      cfd,
      idCertifinfo,
      slug
    );

    if (!formationsWithCampagnes?.length) {
      return { success: false, body: "Formation not found" };
    }

    const campagneIds = formationsWithCampagnes.map((formation) => formation.campagneId);

    if (!campagneIds.length) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const query = { campagneIds: campagneIds.filter((id) => id !== null) };
    const temoignages = await temoignagesDao.findAll(query);

    if (!temoignages.length || temoignages.length === 1) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const commentVisTonExperienceEntreprise = temoignages
      .map((temoignage) => {
        if (
          temoignage.reponses &&
          typeof temoignage.reponses === "object" &&
          "commentVisTonExperienceEntreprise" in temoignage.reponses
        ) {
          return temoignage.reponses["commentVisTonExperienceEntreprise"];
        }
        return null;
      })
      .filter(Boolean)
      .filter(Boolean);

    const cfaAideTrouverEntreprise = temoignages
      .map((temoignage) => {
        if (
          temoignage.reponses &&
          typeof temoignage.reponses === "object" &&
          "cfaAideTrouverEntreprise" in temoignage.reponses
        ) {
          return temoignage.reponses["cfaAideTrouverEntreprise"];
        }
        return null;
      })
      .filter(Boolean);

    const commentTrouverEntreprise = temoignages
      .map((temoignage) => {
        if (
          temoignage.reponses &&
          typeof temoignage.reponses === "object" &&
          "commentTrouverEntreprise" in temoignage.reponses
        ) {
          return temoignage.reponses["commentTrouverEntreprise"];
        }
        return null;
      })
      .filter(Boolean);

    const trouverEntrepriseRating = getTrouverEntrepriseRating(cfaAideTrouverEntreprise, commentTrouverEntreprise);

    const commentVisTonExperienceEntrepriseRating = getCommentVisTonExperienceEntrepriseRating(
      commentVisTonExperienceEntreprise
    );

    const commentVisTonEntrepriseOrder = getCommentVisTonExperienceEntrepriseOrder(commentVisTonExperienceEntreprise);

    const verbatimsQuery = {
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

    const verbatimsResults = await verbatimsDao.getAll(verbatimsQuery);

    const verbatimsWithEtablissement = verbatimsResults.map((verbatim) => {
      const relatedTemoignage = temoignages.find((temoignage) => temoignage.id === verbatim.temoignageId);

      if (!relatedTemoignage) {
        return verbatim;
      }

      return {
        ...verbatim,
        etablissementFormateurEntrepriseRaisonSociale: relatedTemoignage.etablissementFormateurEntrepriseRaisonSociale,
        etablissementFormateurEnseigne: relatedTemoignage.etablissementFormateurEnseigne,
        etablissementGestionnaireEnseigne: relatedTemoignage.etablissementGestionnaireEnseigne,
      };
    });

    const matchedVerbatimAndThemes = verbatimsAnOrderedThemeAnswersMatcher(
      verbatimsWithEtablissement,
      commentVisTonEntrepriseOrder
    );

    const allGems = getGemVerbatimsByWantedQuestionKey(verbatimsWithEtablissement);
    const gems = getGemVerbatimsByWantedQuestionKey(verbatimsWithEtablissement.splice(0, 5));

    const etablissementsCount = temoignages.reduce((acc: Record<string, number>, temoignage) => {
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
      intituleFormation: formationsWithCampagnes[0].intituleLong,
      verbatimsByThemes: matchedVerbatimAndThemes,
      gems,
      verbatimsByQuestions: allGems,
      commentVisTonExperienceEntrepriseRating,
      trouverEntrepriseRating,
    };

    return { success: true, body: result };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getDatavisualisationFormationExists = async (
  intituleFormation: string | null,
  cfd: string | null,
  idCertifinfo: string | null,
  slug: string | null
) => {
  try {
    const formattedIntituleFormation = intituleFormation ? intituleFormationFormatter(intituleFormation) : null;

    const formationsWithCampagnes = await formationsDao.findFormationByIntituleCfdIdCertifInfoOrSlug(
      formattedIntituleFormation,
      cfd,
      idCertifinfo,
      slug
    );

    if (!formationsWithCampagnes?.length) {
      return { success: true, body: { hasData: false } };
    }

    const campagneIds = formationsWithCampagnes.map((formation) => formation.campagneId);

    if (!campagneIds.length) {
      return { success: true, body: { hasData: false } };
    }

    const query = { campagneIds: campagneIds.filter((id) => id !== null) };
    const temoignages = await temoignagesDao.findAll(query);

    if (!temoignages.length || temoignages.length === 1) {
      return { success: true, body: { hasData: false } };
    }

    return { success: true, body: { hasData: true } };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getDatavisualisationEtablissement = async (uai: string) => {
  try {
    const formations = await formationsDao.findFormationByUai(uai);

    if (!formations?.length) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const campagneIds = formations.map((formation) => formation.campagneId);

    if (!campagneIds.length) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const query = { campagneIds: campagneIds.filter((id) => id !== null) };
    const temoignages = await temoignagesDao.findAll(query);

    if (!temoignages.length) {
      return { success: true, body: { temoignagesCount: 0 } };
    }

    const commentCaSePasseCfa = temoignages.map((temoignage) => {
      if (
        temoignage.reponses &&
        typeof temoignage.reponses === "object" &&
        "commentCaSePasseCfa" in temoignage.reponses
      ) {
        return temoignage.reponses["commentCaSePasseCfa"];
      }
      return null;
    });
    const commentCaSePasseCfaRates = getReponseRating(commentCaSePasseCfa);

    const commentVisTonExperienceCfa = temoignages.map((temoignage) => {
      if (
        temoignage.reponses &&
        typeof temoignage.reponses === "object" &&
        "commentVisTonExperienceCfa" in temoignage.reponses
      ) {
        return temoignage.reponses["commentVisTonExperienceCfa"];
      }
      return null;
    });

    const commentVisTonExperienceCfaOrder = getCommentVisTonExperienceEntrepriseOrder(commentVisTonExperienceCfa); // change name if working for CFA
    const commentVisTonCfaVerbatimsQuery = {
      temoignageIds: temoignages.map((temoignage) => temoignage.id),
      status: [VERBATIM_STATUS.GEM, VERBATIM_STATUS.VALIDATED],
    };
    const commentVisTonCfaVerbatimsResults = await verbatimsDao.getAll(commentVisTonCfaVerbatimsQuery);

    const matchedVerbatimAndcommentVisTonCfa = verbatimsAnOrderedThemeAnswersMatcher(
      commentVisTonCfaVerbatimsResults,
      commentVisTonExperienceCfaOrder
    );

    const accompagneCfa = temoignages.map((temoignage) => {
      if (
        temoignage.reponses &&
        typeof temoignage.reponses === "object" &&
        "sensTuAccompagneAuCfa" in temoignage.reponses
      ) {
        return temoignage.reponses["sensTuAccompagneAuCfa"];
      }
      return null;
    });

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
}: {
  type: (typeof UNCOMPLIANT_TEMOIGNAGE_TYPE)[keyof typeof UNCOMPLIANT_TEMOIGNAGE_TYPE];
  duration: number;
  answeredQuestions: number;
  includeUnavailableDuration: boolean;
  page: number;
  pageSize: number;
}) => {
  const uncompliantsQuery = {
    isBot: true,
    incompleteNumber: answeredQuestions,
    timeToRespondLimit: 1000 * 60 * duration,
    includeUnavailableDuration,
  };

  let temoignages;
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
      body: temoignages?.rows,
      count: {
        total: uncompliantsCount.botCount + uncompliantsCount.incompleteCount + uncompliantsCount.quickCount,
        ...uncompliantsCount,
      },
      pagination: {
        totalItemsCountPerType,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalItemsCountPerType / pageSize),
        hasMore: temoignages?.hasNextPage || false,
      },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const deleteMultipleTemoignages = async (temoignagesIds: string[]) => {
  try {
    const temoignages = await temoignagesDao.deleteMultiple(temoignagesIds);
    return { success: true, body: temoignages };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const exportTemoignagesToXlsx = async (campagneIds: string[], res: Response) => {
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
