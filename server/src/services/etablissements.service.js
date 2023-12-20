const etablissementsDao = require("../dao/etablissements.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const { getChampsLibreCount } = require("../utils/verbatims.utils");

const createEtablissement = async (etablissement) => {
  try {
    const existingEtablissementQuery = {
      "data._id": etablissement.data._id,
    };
    const existingEtablissement = await etablissementsDao.getAll(existingEtablissementQuery);

    if (existingEtablissement.length) {
      throw new Error("Etablissement déjà existant");
    }
    const createdEtablissement = await etablissementsDao.create(etablissement);

    return { success: true, body: createdEtablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissements = async (query) => {
  try {
    const etablissements = await etablissementsDao.getAll(query);
    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissement = async (id) => {
  try {
    const etablissement = await etablissementsDao.getOne(id);
    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteEtablissement = async (id) => {
  try {
    const etablissement = await etablissementsDao.deleteOne(id);
    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateEtablissement = async (id, updatedEtablissement) => {
  try {
    const etablissement = await etablissementsDao.update(id, updatedEtablissement);

    if (!etablissement) throw new Error("Etablissement not found");

    return { success: true, body: etablissement };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissementsSuivi = async () => {
  try {
    const etablissements = await etablissementsDao.getAllSuivi();

    let questionnaireIds = [];

    etablissements.forEach((etablissement) => {
      const campagnesQuestionnairesIds = etablissement.campagnes.map((campagne) => campagne.questionnaireId);
      questionnaireIds.push(...campagnesQuestionnairesIds);
    });

    const uniqueQuestionnaireIds = [...new Set(questionnaireIds)];

    let questionnairePromises = uniqueQuestionnaireIds.map((questionnaireId) => {
      return questionnairesDao.getOne(questionnaireId);
    });

    let uniqueQuestionnaire = await Promise.all(questionnairePromises);

    etablissements.forEach((etablissement) => {
      etablissement.campagnes.forEach((campagne) => {
        const questionnaire = uniqueQuestionnaire.find(
          (questionnaire) => questionnaire._id.toString() === campagne.questionnaireId
        );
        const temoignagesList = etablissement.temoignages.filter(
          (temoignage) => temoignage.campagneId.toString() === campagne._id.toString()
        );

        campagne.champsLibreCount = getChampsLibreCount(questionnaire.questionnaireUI, temoignagesList);
      });
      const allCampagneChampsLibreCount = etablissement.campagnes.map((campagne) => campagne.champsLibreCount);

      etablissement.champsLibreCount = allCampagneChampsLibreCount.reduce((a, b) => a + b, 0);
      etablissement.temoignagesCount = etablissement.temoignages.length;

      delete etablissement.temoignages;
      delete etablissement.campagnes;
    });

    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = {
  createEtablissement,
  getEtablissements,
  getEtablissement,
  deleteEtablissement,
  updateEtablissement,
  getEtablissementsSuivi,
};
