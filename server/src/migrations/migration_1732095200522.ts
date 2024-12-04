// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Kysely, sql } from "kysely";

export const up = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
        CREATE TABLE jobs (
            id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
            type VARCHAR(255) NOT NULL,
            status VARCHAR(255) NOT NULL,
            progress INTEGER DEFAULT 0,
            total INTEGER DEFAULT 0,
            error TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    `.compile(db)
  );
};

export const down = async (db: Kysely<unknown>) => {
  await db.executeQuery(
    sql`
          DROP TABLE IF EXISTS jobs;
        `.compile(db)
  );
};
