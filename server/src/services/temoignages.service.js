const temoignagesDao = require("../dao/temoignages.dao");
const campagnesDao = require("../dao/campagnes.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const { ErrorMessage } = require("../errors");
const { getChampsLibreField } = require("../utils/verbatims.utils");
const { VERBATIM_STATUS } = require("../constants");

const createTemoignage = async (temoignage) => {
  try {
    const campagneQuery = { id: temoignage.campagneId };
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagneQuery);

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

const getTemoignages = async (campagneIds) => {
  try {
    const query = { campagneId: { $in: campagneIds } };
    const temoignages = await temoignagesDao.getAll(query);
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

const deleteTemoignage = async (id) => {
  try {
    const temoignage = await temoignagesDao.deleteOne(id);
    return { success: true, body: temoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateTemoignage = async (id, updatedTemoignage) => {
  try {
    const temoignageToUpdate = await temoignagesDao.getOne(id);
    const campagneQuery = { id: temoignageToUpdate.campagneId };
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagneQuery);

    if (!campagne?.length) throw new Error("Campagne not found");

    const temoignage = await temoignagesDao.update(id, updatedTemoignage);

    return { success: true, body: temoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { createTemoignage, getTemoignages, deleteTemoignage, updateTemoignage };
