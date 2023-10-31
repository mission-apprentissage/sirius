const temoignagesDao = require("../dao/temoignages.dao");
const campagnesDao = require("../dao/campagnes.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const { ErrorMessage } = require("../errors");
const { getChampsLibreField } = require("../utils/verbatims.utils");

const createTemoignage = async (temoignage) => {
  try {
    const campagneQuery = { id: temoignage.campagneId };
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagneQuery);
    const temoignageCount = await temoignagesDao.countByCampagne(temoignage.campagneId);

    if (!campagne) throw new Error("Campagne not found");

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

const getTemoignages = async (query) => {
  try {
    const temoignages = await temoignagesDao.getAll(query);
    const campagne = await campagnesDao.getOne(query.campagneId);

    if (!campagne) {
      return { success: false, body: ErrorMessage.CampagneNotFoundError };
    }

    const questionnaire = await questionnairesDao.getOne(campagne.questionnaireId);

    if (!questionnaire) {
      return { success: false, body: ErrorMessage.QuestionnaireNotFoundError };
    }

    const verbatimsFields = getChampsLibreField(questionnaire.questionnaireUI);

    temoignages.forEach((item) => {
      const reponses = item.reponses;
      for (const key of verbatimsFields) {
        if (reponses[key] && reponses[key].status !== "VALIDATED") {
          delete reponses[key];
        }
      }
    });

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
    const temoignage = await temoignagesDao.update(id, updatedTemoignage);

    const campagneQuery = { id: temoignage.campagneId };
    const campagne = await campagnesDao.getOneWithTemoignagneCountAndTemplateName(campagneQuery);

    const temoignageCount = await temoignagesDao.countByCampagne(temoignage.campagneId);

    if (!campagne) throw new Error("Campagne not found");

    if (new Date(campagne.startDate) > new Date()) {
      return { success: false, body: ErrorMessage.CampagneNotStarted };
    }
    if (new Date(campagne.endDate) < new Date()) {
      return { success: false, body: ErrorMessage.CampagneEnded };
    }
    if (campagne.seats && temoignageCount >= campagne.seats) {
      return { success: false, body: ErrorMessage.NoSeatsAvailable };
    }
    return { success: true, body: temoignage };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { createTemoignage, getTemoignages, deleteTemoignage, updateTemoignage };
