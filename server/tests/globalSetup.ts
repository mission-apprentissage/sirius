import { config } from "dotenv";

import { dropdb, getDefaultClient, listDatabases } from "./integration/utils/pgtools.test.utils";

export default async () => {
  return async () => {
    config({ path: "./server/.env.test" });

    const pgClient = await getDefaultClient();
    try {
      if (process.env.CI) {
        return;
      }

      await pgClient.connect();
      const dbs = await listDatabases(pgClient);
      await Promise.all(
        dbs.map(async (db) => {
          if (db.startsWith("postgres-test-")) {
            return dropdb(db, {}, pgClient);
          }
          return;
        })
      );
    } catch (e) {
      console.error(e);
    } finally {
      await pgClient.end();
    }
  };
};
