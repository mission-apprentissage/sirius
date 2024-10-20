import type { InsertResult, UpdateResult } from "kysely";

import { kdb } from "../db/db";
import type { Questionnaire } from "../types";

export const create = async (questionnaire: Questionnaire): Promise<InsertResult> => {
  return kdb.insertInto("questionnaires").values(questionnaire).executeTakeFirst();
};

export const findAll = async (): Promise<Questionnaire[] | undefined> => {
  return kdb.selectFrom("questionnaires").selectAll().execute();
};

export const deleteOne = async (id: string): Promise<UpdateResult | undefined> => {
  return kdb.updateTable("questionnaires").set({ deleted_at: new Date() }).where("id", "=", id).executeTakeFirst();
};

export const update = async (
  id: string,
  updatedQuestionnaire: Partial<Questionnaire>
): Promise<UpdateResult | undefined> => {
  return kdb
    .updateTable("questionnaires")
    .set(updatedQuestionnaire)
    .where("id", "=", id)
    .where("deleted_at", "is", null)
    .executeTakeFirst();
};

export const getOne = async (id: string): Promise<Questionnaire | undefined> => {
  return await kdb.selectFrom("questionnaires").selectAll().where("id", "=", id).executeTakeFirst();
};
