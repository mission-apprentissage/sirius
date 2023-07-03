const questionnairesDao = require("../dao/questionnaires.dao");

const createQuestionnaire = async (questionnaire) => {
  try {
    const createdQuestionnaire = await questionnairesDao.create(questionnaire);

    return { success: true, body: createdQuestionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

const getQuestionnaires = async (query) => {
  try {
    const questionnaires = await questionnairesDao.getAll(query);
    return { success: true, body: questionnaires };
  } catch (error) {
    return { success: false, body: error };
  }
};

const deleteQuestionnaire = async (id) => {
  try {
    const questionnaire = await questionnairesDao.deleteOne(id);
    return { success: true, body: questionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

const updateQuestionnaire = async (id, updatedQuestionnaire) => {
  try {
    const questionnaire = await questionnairesDao.update(id, updatedQuestionnaire);

    if (!questionnaire) throw new Error("Questionnaire not found");

    return { success: true, body: questionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

module.exports = { createQuestionnaire, getQuestionnaires, deleteQuestionnaire, updateQuestionnaire };
