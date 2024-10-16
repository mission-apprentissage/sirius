/* eslint-disable no-process-exit */
import { Migrator } from "kysely";

import { kdb } from "../db/db";
import { migrations } from "./index";

const makeMigrator = () => {
  return new Migrator({
    db: kdb,
    allowUnorderedMigrations: false,
    provider: { getMigrations: async () => migrations },
  });
};

export const migrateDownDB = async (numberOfMigrations: number) => {
  const migrator = makeMigrator();
  for (let i = 0; i < numberOfMigrations; i++) {
    const { results, error } = await migrator.migrateDown();
    results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(`migration "${it.migrationName}" was executed successfully (DOWN)`);
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}" (DOWN)`);
      }
    });
    if (error) {
      console.error("failed to migrate down");
      console.error(error);
      throw new Error("failed to migrate down");
    }
  }
};

export const migrateToLatest = async (keepAlive?: boolean) => {
  const migrator = makeMigrator();

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully (UP)`);
      process.exit(1);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}" (UP)`);
      process.exit(1);
    }
  });

  if (!results?.length) {
    console.log("already up to date !");
    process.exit(1);
  }

  if (error) {
    console.error("failed to migrate up");
    console.error(error);
    process.exit(1);
  }

  if (!keepAlive) {
    await kdb.destroy();
  }
};
