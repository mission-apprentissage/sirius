import type { Kysely } from "kysely";
import { sql } from "kysely";

import type { DB } from "../db/schema";

export const up = async (db: Kysely<any>) => {
  try {
    await db.executeQuery(
      sql`
            ALTER TABLE formations
                ADD COLUMN cfd CHAR(8)[];
          `.compile(db)
    );

    const formations = await db
      .selectFrom("formations")
      .select("id")
      .select(sql<string>`catalogue_data->>'cfd'`.as("cfd"))
      .execute();

    for (const formation of formations) {
      if (!formation.cfd) {
        continue;
      }

      await db
        .updateTable("formations")
        .set({
          cfd: [formation.cfd],
        })
        .where("id", "=", formation.id)
        .execute();
    }
  } catch (error) {
    console.error(error);
  }
};

export const down = async (db: Kysely<DB>) => {
  try {
    await db.schema.alterTable("formations").dropColumn("cfd").execute();
  } catch (error) {
    console.error(error);
  }
};
