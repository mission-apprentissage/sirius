import type { Kysely } from "kysely";
import { sql } from "kysely";

import type { DB } from "../db/schema";

export const up = async (db: Kysely<DB>) => {
  try {
    await db.executeQuery(
      sql`
            ALTER TABLE users
              ADD COLUMN created_at TIMESTAMPTZ,
              ADD COLUMN updated_at TIMESTAMPTZ;
              
            ALTER TABLE users
              ALTER COLUMN created_at SET DEFAULT NOW(),
              ALTER COLUMN updated_at SET DEFAULT NOW();
          `.compile(db)
    );
  } catch (error) {
    console.error(error);
  }
};

export const down = async (db: Kysely<DB>) => {
  try {
    await db.schema.alterTable("users").dropColumn("created_at").dropColumn("updated_at").execute();
  } catch (error) {
    console.error(error);
  }
};
