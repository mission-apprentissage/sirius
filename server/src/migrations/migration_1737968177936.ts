import type { Kysely } from "kysely";
import { sql } from "kysely";

import type { DB } from "../db/schema";

export const up = async (db: Kysely<DB>) => {
  try {
    await db.executeQuery(
      sql`
            ALTER TABLE users
              ADD COLUMN notifications_email JSONB;
          `.compile(db)
    );
  } catch (error) {
    console.error(error);
  }
};

export const down = async (db: Kysely<DB>) => {
  try {
    await db.schema.alterTable("users").dropColumn("notifications_email").execute();
  } catch (error) {
    console.error(error);
  }
};
