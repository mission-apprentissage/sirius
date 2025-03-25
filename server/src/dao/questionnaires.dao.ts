import camelcaseKeys from "camelcase-keys";
import decamelizeKeys from "decamelize-keys";
import type { InsertResult, UpdateResult } from "kysely";

import { getKbdClient } from "../db/db";
import type { Questionnaire, QuestionnaireCreation, QuestionnaireUpdate } from "../types";

export const create = async (questionnaire: QuestionnaireCreation): Promise<InsertResult> => {
  return getKbdClient().insertInto("questionnaires").values(questionnaire).executeTakeFirst();
};

export const findAll = async (): Promise<Questionnaire[] | undefined> => {
  const baseQuery = getKbdClient().selectFrom("questionnaires").selectAll();

  const results = await baseQuery.execute();

  return camelcaseKeys(results);
};

export const deleteOne = async (id: string): Promise<UpdateResult | undefined> => {
  return getKbdClient()
    .updateTable("questionnaires")
    .set({ deleted_at: new Date() })
    .where("id", "=", id)
    .executeTakeFirst();
};

export const update = async (
  id: string,
  updatedQuestionnaire: QuestionnaireUpdate
): Promise<UpdateResult | undefined> => {
  return getKbdClient()
    .updateTable("questionnaires")
    .set(decamelizeKeys(updatedQuestionnaire))
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();
};

export const getOne = async (id: string): Promise<Questionnaire | undefined> => {
  const baseQuery = getKbdClient().selectFrom("questionnaires").selectAll().where("id", "=", id);

  const result = await baseQuery.executeTakeFirst();

  return result ? camelcaseKeys(result) : undefined;
};
