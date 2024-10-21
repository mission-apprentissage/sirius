import { Client } from "pg";
// eslint-disable-next-line node/no-unpublished-import
import { beforeAll, beforeEach } from "vitest";

import config from "../../../src/config";
import { connectToPgDb } from "../../../src/db/db";
import { migrateToLatest } from "../../../src/migrations/migrate";

let client: Client | null = null;
export const startAndConnectPg = async () => {
  const workerId = `${process.env.VITEST_POOL_ID}-${process.env.VITEST_WORKER_ID}`;

  client = new Client({
    host: "localhost",
    user: "postgres",
    password: "password",
    port: 5432,
  });

  const dbUri = config.psql.uri.replace("VITEST_POOL_ID", workerId);
  const database = `postgres-test-${workerId}`;

  await client.connect();
  await client.query(`CREATE DATABASE "${database}";`);

  await connectToPgDb(dbUri);
  await migrateToLatest(true, false);
};

export const stopPg = async () => {
  // await client.query(`DROP DATABASE "${database}";`);

  await client?.end();
};

export const usePg = (clearStep: "beforeEach" | "beforeAll" = "beforeEach") => {
  beforeAll(async () => {
    await startAndConnectPg();
    if (clearStep === "beforeAll") {
      // await clearAllCollections();
    }

    return async () => stopPg();
  });

  beforeEach(async () => {
    if (clearStep === "beforeEach") {
      // await clearAllCollections();
    }
  });
};
