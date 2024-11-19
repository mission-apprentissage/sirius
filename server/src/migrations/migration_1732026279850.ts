import type { Kysely } from "kysely";

export const up = async (db: any) => {
  await db.schema
    .alterTable("verbatims")
    .addColumn("feedback_count", "integer", (col: any) => col.defaultTo(0))
    .execute();
};

export const down = async (db: Kysely<any>) => {
  await db.schema.alterTable("verbatims").dropColumn("feedback_count").execute();
};
