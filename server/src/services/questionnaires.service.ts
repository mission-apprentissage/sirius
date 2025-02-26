import * as questionnairesDao from "../dao/questionnaires.dao";
import type { QuestionnaireCreation, QuestionnaireUpdate } from "../types";

export const createQuestionnaire = async (questionnaire: QuestionnaireCreation) => {
  try {
    const createdQuestionnaire = await questionnairesDao.create(questionnaire);

    return { success: true, body: createdQuestionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getQuestionnaires = async () => {
  try {
    const questionnaires = await questionnairesDao.findAll();
    return { success: true, body: questionnaires };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getOneQuestionnaire = async (id: string) => {
  try {
    const questionnaire = await questionnairesDao.getOne(id);
    return { success: true, body: questionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const deleteQuestionnaire = async (id: string) => {
  try {
    const questionnaire = await questionnairesDao.deleteOne(id);
    return { success: true, body: questionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const updateQuestionnaire = async (id: string, updatedQuestionnaire: QuestionnaireUpdate) => {
  try {
    const questionnaire = await questionnairesDao.update(id, updatedQuestionnaire);

    if (!questionnaire) throw new Error("Questionnaire not found");

    return { success: true, body: questionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};
