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
  const questionnaireId = query.questionnaireId;
  const etablissementSiret = query.etablissementSiret || null;
  const formationId = query.formationId || null;

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

    let filteredVerbatims = [];

    if (etablissementSiret) {
      filteredVerbatims = verbatimsWithCampagneName.filter(
        (verbatim) => verbatim.etablissementSiret === etablissementSiret
      );
    }

    if (formationId) {
      filteredVerbatims = verbatimsWithCampagneName.filter((verbatim) => verbatim.formationId === formationId);
    }

    return { success: true, body: filteredVerbatims.length ? filteredVerbatims : verbatimsWithCampagneName };
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

module.exports = { getVerbatims, patchVerbatim };
