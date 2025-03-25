import type { InsertResult, UpdateResult } from "kysely";

import * as questionnairesDao from "../dao/questionnaires.dao";
import { QuestionnaireNotFoundError } from "../errors";
import type { Questionnaire, QuestionnaireCreation, QuestionnaireUpdate } from "../types";

export const createQuestionnaire = async (
  questionnaire: QuestionnaireCreation
): Promise<
  | {
      success: true;
      body: InsertResult;
    }
  | { success: false; body: Error }
> => {
  try {
    const createdQuestionnaire = await questionnairesDao.create(questionnaire);

    return { success: true, body: createdQuestionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getQuestionnaires = async (): Promise<
  | {
      success: true;
      body: Questionnaire[] | undefined;
    }
  | { success: false; body: Error }
> => {
  try {
    const questionnaires = await questionnairesDao.findAll();
    return { success: true, body: questionnaires };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const getOneQuestionnaire = async (
  id: string
): Promise<
  | {
      success: true;
      body: Questionnaire | undefined;
    }
  | { success: false; body: Error }
> => {
  try {
    const questionnaire = await questionnairesDao.getOne(id);
    return { success: true, body: questionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const deleteQuestionnaire = async (
  id: string
): Promise<
  | {
      success: true;
      body: UpdateResult | undefined;
    }
  | { success: false; body: Error }
> => {
  try {
    const questionnaire = await questionnairesDao.deleteOne(id);
    return { success: true, body: questionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};

export const updateQuestionnaire = async (
  id: string,
  updatedQuestionnaire: QuestionnaireUpdate
): Promise<
  | {
      success: true;
      body: UpdateResult | undefined;
    }
  | { success: false; body: Error }
> => {
  try {
    const questionnaire = await questionnairesDao.update(id, updatedQuestionnaire);

    if (!questionnaire) throw new QuestionnaireNotFoundError();

    return { success: true, body: questionnaire };
  } catch (error) {
    return { success: false, body: error };
  }
};
