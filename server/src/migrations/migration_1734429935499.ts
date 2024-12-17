import type { Kysely } from "kysely";

import type { DB } from "../db/schema";

export const up = async (db: Kysely<DB>) => {
  try {
    await db.schema
      .alterTable("verbatims")
      .addColumn("is_corrected", "boolean", (col) => col.notNull().defaultTo(false))
      .addColumn("content_corrected", "text", (col) => col.defaultTo(null))
      .addColumn("correction_justification", "text", (col) => col.defaultTo(null))
      .addColumn("is_anonymized", "boolean", (col) => col.notNull().defaultTo(false))
      .addColumn("content_corrected_anonymized", "text", (col) => col.defaultTo(null))
      .addColumn("anonymization_justification", "text", (col) => col.defaultTo(null))
      .execute();
  } catch (error) {
    console.error(error);
  }
};

export const down = async (db: Kysely<DB>) => {
  try {
    await db.schema
      .alterTable("verbatims")
      .dropColumn("is_corrected")
      .dropColumn("content_corrected")
      .dropColumn("correction_justification")
      .dropColumn("is_anonymized")
      .dropColumn("content_corrected_anonymized")
      .dropColumn("anonymization_justification")
      .execute();
  } catch (error) {
    console.error(error);
  }
};
