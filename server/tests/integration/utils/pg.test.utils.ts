// eslint-disable-next-line node/no-unpublished-import
import { beforeAll, beforeEach } from "vitest";

import config from "../../../src/config";
import { closePgDbConnection, connectToPgDb } from "../../../src/db/db";
import { migrateToLatest } from "../../../src/migrations/migrate";
import { createdb } from "../../../src/utils/pgtools.utils";

export const startAndConnectPg = async () => {
  const workerId = `${process.env.VITEST_POOL_ID}-${process.env.VITEST_WORKER_ID}`;

  const dbUri = config.psql.uri.replace("VITEST_POOL_ID", workerId);
  const testDb = `sirius-test-${workerId}`;

  try {
    await createdb(testDb, config.psql);

    await connectToPgDb(dbUri);

    await migrateToLatest(true, false);
  } catch (error) {
    console.error(error);
  }
};

export const stopPg = async () => {
  await closePgDbConnection();
};

export const usePg = (clearStep: "beforeEach" | "beforeAll" = "beforeEach") => {
  beforeAll(async () => {
    await startAndConnectPg();
    if (clearStep === "beforeAll") {
      // clearAll or drop
    }

    return async () => stopPg();
  });

  beforeEach(async () => {
    if (clearStep === "beforeEach") {
      // clearAll or drop
    }
  });
};
