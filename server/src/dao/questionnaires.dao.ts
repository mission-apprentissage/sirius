import type { InsertResult, UpdateResult } from "kysely";

import { getKbdClient } from "../db/db";
import type { Questionnaire } from "../types";

export const create = async (questionnaire: Questionnaire): Promise<InsertResult> => {
  return getKbdClient().insertInto("questionnaires").values(questionnaire).executeTakeFirst();
};

export const findAll = async (): Promise<Questionnaire[] | undefined> => {
  return getKbdClient().selectFrom("questionnaires").selectAll().execute();
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
  updatedQuestionnaire: Partial<Questionnaire>
): Promise<UpdateResult | undefined> => {
  return getKbdClient()
    .updateTable("questionnaires")
    .set(updatedQuestionnaire)
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();
};

export const getOne = async (id: string): Promise<Questionnaire | undefined> => {
  return await getKbdClient().selectFrom("questionnaires").selectAll().where("id", "=", id).executeTakeFirst();
};
