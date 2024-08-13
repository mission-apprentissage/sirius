const etablissementsDao = require("../dao/etablissements.dao");
const questionnairesDao = require("../dao/questionnaires.dao");
const campagnesDao = require("../dao/campagnes.dao");
const temoignagesDao = require("../dao/temoignages.dao");
const verbatimsDao = require("../dao/verbatims.dao");
const { getChampsLibreField } = require("../utils/verbatims.utils");

const createEtablissements = async (etablissementsArray) => {
  try {
    let createdEtablissements = [];

    for (const etablissement of etablissementsArray) {
      const existingEtablissementQuery = {
        "catalogue_id": etablissement._id,
      };
      const existingEtablissement = await etablissementsDao.findAll(existingEtablissementQuery);

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
    const query = search ? { searchText: search } : {};
    const etablissements = await etablissementsDao.findAll(query);

    return { success: true, body: etablissements };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissementsWithTemoignageCount = async () => {
  try {
    const formations = await etablissementsDao.findAllWithTemoignageCount();
    return { success: true, body: formations };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getEtablissement = async (id) => {
  try {
    const etablissement = await etablissementsDao.findOne(id);
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
    const etablissements = await etablissementsDao.findAllEtablissementWithCounts();

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
  getEtablissementsWithTemoignageCount,
};
