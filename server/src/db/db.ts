import { CamelCasePlugin, DeduplicateJoinsPlugin, Kysely, PostgresDialect } from "kysely";
import pg from "pg";
const { Pool, types } = pg;

import config from "../config";
import type { DB } from "./schema";

types.setTypeParser(types.builtins.INT8, (val) => parseInt(val));
types.setTypeParser(types.builtins.INT4, (val) => parseInt(val));
types.setTypeParser(types.builtins.INT2, (val) => parseInt(val));
types.setTypeParser(types.builtins.FLOAT4, (val) => parseFloat(val));
types.setTypeParser(types.builtins.FLOAT8, (val) => parseFloat(val));
types.setTypeParser(types.builtins.NUMERIC, (val) => parseFloat(val));

const pool = new Pool({
  connectionString: config.psql.uri,
  ssl: config.psql.ca ? { rejectUnauthorized: false, ca: config.psql.ca } : undefined,
});

pool.on("error", (error) => {
  console.error("lost connection with DB: ", error);
});

export const kdb = new Kysely<DB>({
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
