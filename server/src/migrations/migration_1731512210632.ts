import type { Kysely } from "kysely";
import { sql } from "kysely";

interface Database {
  formations: {
    id: string;
    campagne_id: string | null;
    onisep_slug: string | null;
    onisepUrl: string | null;
  };
  campagnes: {
    id: string;
  };
}

export const up = async (db: any) => {
  await db.schema
    .alterTable("formations")
    .addColumn("onisep_slug", "varchar(10)", (col: any) => col.nullable())
    .execute();

  const formations = await db
    .selectFrom("formations")
    .select(["formations.id", sql<string>`catalogue_data->>'onisep_url'`.as("onisep_url")])
    .execute();

  for (const formation of formations) {
    const onisep_slug = formation?.onisepUrl?.match(/FOR\.\d+/);

    if (onisep_slug) {
      await db.updateTable("formations").set({ onisep_slug: onisep_slug[0] }).where("id", "=", formation.id).execute();
    }
  }
};

export const down = async (db: Kysely<Database>) => {
  await db.schema.alterTable("formations").dropColumn("onisep_slug").execute();
};
