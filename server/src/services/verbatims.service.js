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

const getVerbatims = async (query) => {
  const { questionnaireId } = query;
  try {
    const questionnaire = await questionnairesDao.getOne(questionnaireId);

    if (!questionnaire) {
      return { success: false, body: ErrorMessage.QuestionnaireNotFoundError };
    }

    const fieldsWithChampsLibre = getChampsLibreField(questionnaire.questionnaireUI);
    const titles = findTitlesInJSON(questionnaire.questionnaire, fieldsWithChampsLibre);

    const campagnesByQuestionnaireId = await campagnesDao.getAll({ questionnaireId });

    if (!campagnesByQuestionnaireId) {
      return { success: false, body: ErrorMessage.CampagneNotFoundError };
    }

    const query = { campagneId: { $in: campagnesByQuestionnaireId.map((campagne) => campagne._id) } };
    const temoignages = await temoignagesDao.getAll(query);
    const verbatimsWithFormation = appendFormationAndEtablissementToVerbatims(temoignages, campagnesByQuestionnaireId);

    if (!temoignages) {
      return { success: false, body: ErrorMessage.TemoignageNotFoundError };
    }

    const verbatimsWithChampsLibre = filterChampsLibresAndFlatten(verbatimsWithFormation, fieldsWithChampsLibre);

    const verbatimsWithCampagneName = appendVerbatimsWithCampagneNameAndRestructure(
      verbatimsWithChampsLibre,
      campagnesByQuestionnaireId,
      titles
    );

    return { success: true, body: verbatimsWithCampagneName };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { getVerbatims };
