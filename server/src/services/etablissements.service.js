const etablissementsDao = require("../dao/etablissements.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const campagnesDao = require("../dao/campagnes.dao");
const temoignagesDao = require("../dao/temoignages.dao");
const verbatimsDao = require("../dao/verbatims.dao");
const retainFields = require("../utils/retainFields.utils");
const { getChampsLibreCount, getChampsLibreField } = require("../utils/verbatims.utils");

const etablissementFieldsToRetain = [
  "_id",
  "formationIds",
  "data._id",
  "data.onisep_nom",
  "data.enseigne",
  "data.entreprise_raison_sociale",
  "data.siret",
];

const createEtablissements = async (etablissementsArray) => {
  try {
    let createdEtablissements = [];

    for (const etablissement of etablissementsArray) {
      const existingEtablissementQuery = {
        "data._id": etablissement.data._id,
      };
      const existingEtablissement = await etablissementsDao.getAll(existingEtablissementQuery);

      if (!existingEtablissement.length) {
        const createdEtablissement = await etablissementsDao.create(etablissement);
        createdEtablissements.push(createdEtablissement);
      }
    }

    return { success: true, body: createdEtablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissements = async ({ search }) => {
  try {
    const query = search ? { $text: { $search: search } } : {};
    const etablissements = await etablissementsDao.getAll(query);

    const cleanedEtablissements = retainFields(etablissements, etablissementFieldsToRetain);

    return { success: true, body: cleanedEtablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissementsWithTemoignageCount = async () => {
  try {
    const formations = await etablissementsDao.getAllWithTemoignageCount();
    return { success: true, body: formations };
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

const getEtablissementsPublicStatistics = async () => {
  try {
    const etablissementsCount = await etablissementsDao.count();
    const createdCampagnesCount = await campagnesDao.count();
    const temoignagesCount = await temoignagesDao.count();

    const onlyQpenQuestionKeyList = [];
    const questionnaires = await questionnairesDao.getAll();
    questionnaires.forEach((questionnaire) => [
      onlyQpenQuestionKeyList.push(getChampsLibreField(questionnaire.questionnaireUI, true)),
    ]);
    const uniqueChampsLibreFields = [...new Set(onlyQpenQuestionKeyList.flat())];

    const verbatimsCountByStatus = await verbatimsDao.count({ questionKey: { $in: uniqueChampsLibreFields } });
    const totalVerbatimCount = verbatimsCountByStatus.reduce((acc, verbatim) => acc + verbatim.count, 0);

    return {
      success: true,
      body: { etablissementsCount, createdCampagnesCount, temoignagesCount, verbatimsCount: totalVerbatimCount },
    };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = {
  createEtablissements,
  getEtablissements,
  getEtablissement,
  deleteEtablissement,
  updateEtablissement,
  getEtablissementsSuivi,
  getEtablissementsPublicStatistics,
  etablissementFieldsToRetain,
  getEtablissementsWithTemoignageCount,
};
