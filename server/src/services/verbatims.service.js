const temoignagesDao = require("../dao/temoignages.dao");
const campagnesDao = require("../dao/campagnes.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const { ErrorMessage } = require("../errors");
const {
  getChampsLibreField,
  findTitlesInJSON,
  appendFormationAndEtablissementToVerbatims,
  filterChampsLibresAndFlatten,
  appendVerbatimsWithCampagneNameAndRestructure,
} = require("../utils/verbatims.utils");
const { VERBATIM_STATUS } = require("../constants");

const getVerbatims = async (query) => {
  const etablissementSiret = query.etablissementSiret || null;
  const formationId = query.formationId || null;
  const questionKey = query.question || null;
  const selectedStatus = query.selectedStatus ? query.selectedStatus.split(",") : Object.keys(VERBATIM_STATUS);
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 100;

  try {
    const allQuestionnaires = await questionnairesDao.getAll();

    let allVerbatims = [];
    let totalCount = 0;
    let pendingCount = 0;
    let validatedCount = 0;
    let rejectedCount = 0;

    for (const questionnaire of allQuestionnaires) {
      const fieldsWithChampsLibre = getChampsLibreField(questionnaire.questionnaireUI);
      const titles = findTitlesInJSON(questionnaire.questionnaire, fieldsWithChampsLibre);

      const campagneQuery = {
        questionnaireId: questionnaire._id.toString(),
        ...(etablissementSiret && { etablissementSiret }),
        ...(formationId && { formationId }),
      };

      const campagnesByQuestionnaireId = await campagnesDao.getAllWithTemoignageCountFormationEtablissement(
        campagneQuery
      );

      if (!campagnesByQuestionnaireId) {
        continue;
      }

      const temoignagesQuery = {
        campagneId: { $in: campagnesByQuestionnaireId.map((campagne) => campagne._id) },
      };

      const temoignages = await temoignagesDao.getAll(temoignagesQuery, questionKey);

      if (!temoignages) {
        continue;
      }

      const verbatimsWithFormation = appendFormationAndEtablissementToVerbatims(
        temoignages,
        campagnesByQuestionnaireId
      );

      const verbatimsWithChampsLibre = filterChampsLibresAndFlatten(verbatimsWithFormation, fieldsWithChampsLibre);
      const verbatimsWithCampagneName = appendVerbatimsWithCampagneNameAndRestructure(
        verbatimsWithChampsLibre,
        campagnesByQuestionnaireId,
        titles
      );

      const filteredByStatus = verbatimsWithCampagneName.filter((verbatim) =>
        selectedStatus.includes(verbatim?.value?.status)
      );

      allVerbatims = allVerbatims.concat(filteredByStatus);
      totalCount += filteredByStatus.length;
      pendingCount += filteredByStatus.filter((verbatim) => verbatim?.value?.status === VERBATIM_STATUS.PENDING).length;
      pendingCount += filteredByStatus.filter((verbatim) => typeof verbatim?.value === "string").length;
      validatedCount += filteredByStatus.filter(
        (verbatim) => verbatim?.value?.status === VERBATIM_STATUS.VALIDATED
      ).length;
      rejectedCount += filteredByStatus.filter(
        (verbatim) => verbatim?.value?.status === VERBATIM_STATUS.REJECTED
      ).length;
    }

    const paginatedVerbatims = allVerbatims.slice((page - 1) * pageSize, page * pageSize);

    return {
      success: true,
      body: { verbatims: paginatedVerbatims, totalCount, pendingCount, validatedCount, rejectedCount },
      pagination: {
        totalItems: totalCount,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

const patchVerbatim = async (id, updatedVerbatim) => {
  try {
    const temoignageToUpdate = await temoignagesDao.getOne(id);

    if (!temoignageToUpdate) {
      return { success: false, body: ErrorMessage.TemoignageNotFoundError };
    }

    temoignageToUpdate.reponses[updatedVerbatim.questionId] = updatedVerbatim.payload;

    const updatedTemoignage = await temoignagesDao.update(id, temoignageToUpdate);

    return { success: true, body: updatedTemoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

const patchMultiVerbatim = async (verbatims) => {
  try {
    let updatedTemoignages = [];

    for (const verbatim of verbatims) {
      const temoignageToUpdate = await temoignagesDao.getOne(verbatim.temoignageId);
      if (!temoignageToUpdate) {
        return { success: false, body: ErrorMessage.TemoignageNotFoundError };
      }

      temoignageToUpdate.reponses[verbatim.questionId] = verbatim.payload;
      const updatedTemoignage = await temoignagesDao.update(verbatim.temoignageId, temoignageToUpdate);
      updatedTemoignages.push(updatedTemoignage);
    }

    return { success: true, body: updatedTemoignages };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { getVerbatims, patchVerbatim, patchMultiVerbatim };
