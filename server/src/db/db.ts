import { CamelCasePlugin, DeduplicateJoinsPlugin, Kysely, PostgresDialect } from "kysely";
import pg from "pg";
const { Pool, types } = pg;

import config from "../config";
import logger from "../modules/logger";
import { sleep } from "../utils/asyncUtils";
import type { DB } from "./schema";

let kdb: Kysely<DB> | null = null;
let pool: pg.Pool | null = null;

types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));
types.setTypeParser(types.builtins.INT4, (val) => parseInt(val));
types.setTypeParser(types.builtins.INT2, (val) => parseInt(val));
types.setTypeParser(types.builtins.FLOAT4, (val) => parseFloat(val));
types.setTypeParser(types.builtins.FLOAT8, (val) => parseFloat(val));
types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));

export const connectToPgDb = async (uri: string) => {
  pool = new Pool({
    connectionString: uri,
    ssl: config.psql.ca ? { rejectUnauthorized: false, ca: config.psql.ca } : undefined,
  });

  pool.on("error", (error) => {
    logger.error("lost connection with DB: ", error);
  });
  // pool.on("connect", () => {
  //   logger.info("Connected to PSQL");
  // });
  // pool.on("acquire", () => {
  //   logger.info("acquire to PSQL");
  // });

  kdb = new Kysely<DB>({
    dialect: new PostgresDialect({ pool }),
    plugins: [new CamelCasePlugin(), new DeduplicateJoinsPlugin()],
    log: (event) => {
      if (event.level === config.psql.logLevel) {
        console.log(`\n====================================\n`);
        console.log(replaceQueryPlaceholders(event.query.sql, event.query.parameters as string[]));
        console.log({
          parameters: event.query.parameters.map((p, index) => `$${index + 1} = ${p}`).join(", "),
        });
        console.log({ duration: event.queryDurationMillis });
      }
    },
  });
};

export const ensureInitialization = () => {
  if (!kdb) {
    throw new Error("Database connection does not exist. Please call connectToPgDb before.");
  }
  return kdb;
};

export const getKbdClient = () => ensureInitialization();

export const closePgDbConnection = async () => {
  logger.warn("Closing PSQL");
  if (process.env.NODE_ENV !== "test") {
    // Let 100ms for possible callback cleanup to register tasks in mongodb queue
    await sleep(200);
  }
  return pool?.end();
};

function replaceQueryPlaceholders(query: string, values: string[]): string {
  let modifiedQuery = query;

  // Replace each placeholder with the corresponding value from the array
  values.forEach((value, index) => {
    // The placeholder in the query will be like $1, $2, etc.
    const placeholder = `$${index + 1}`;
    modifiedQuery = modifiedQuery.replace(placeholder, `'${value}'`);
  });

  return modifiedQuery;
}
