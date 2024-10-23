import { captureException } from "@sentry/node";

import { startCLI } from "./commands";
import config from "./config";
import { connectToPgDb } from "./db/db";
import logger from "./modules/logger";

(async function () {
  try {
    await connectToPgDb(config.psql.uri);

    await startCLI();
  } catch (err) {
    captureException(err);
    logger.error({ err }, "startup error");
    // eslint-disable-next-line n/no-process-exit, no-process-exit
    process.exit(1);
  }
})();
