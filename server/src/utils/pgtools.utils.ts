import type Ipg from "pg";
import pg from "pg";
import type { EmptyObject } from "type-fest";

const { Client } = pg;

const knownErrors = {
  "42P04": {
    name: "duplicate_database",
    message: "Attempted to create a duplicate database.",
  },
  "3D000": {
    name: "invalid_catalog_name",
    message: "Attempted to drop a database that does not exist.",
  },
  23505: {
    name: "unique_violation",
    message: "Attempted to create a database concurrently.",
  },
  55006: {
    name: "drop_database_in_use",
    message: "Attempted to drop a database that is being accessed by other users",
  },
};

const PG_DEFAULT_CONFIG = {
  host: "localhost",
  user: "postgres",
  password: "password",
  port: 5432,
};

class PgtoolsError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(error: any) {
    super();
    this.cause = error;
    // @ts-expect-error
    const { name, message } = knownErrors[error.code] || {
      name: "PgtoolsError",
      message: error.message,
    };
    this.message = message;
    this.name = name;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isPgtoolsError(err: any) {
  return err instanceof Error && "code" in err && "message" in err;
}

export async function getDefaultClient() {
  return new Client(PG_DEFAULT_CONFIG);
}

export async function listDatabases(pgClient: Ipg.Client) {
  const dbs = await pgClient.query(`SELECT datname FROM pg_catalog.pg_database`);
  return dbs.rows.map(({ datname }: { datname: string }) => datname);
}

function createFunction(action: "CREATE" | "DROP") {
  return async function (
    dbName: string,
    opts:
      | {
          host: string;
          user: string;
          password: string;
          port: number;
        }
      | EmptyObject = {},
    openedClient?: Ipg.Client
  ) {
    if (!dbName) throw new TypeError("dbName not set");

    const config = {
      ...PG_DEFAULT_CONFIG,
      ...opts,
    };

    const pgClient = openedClient || new Client(config);

    try {
      if (!openedClient) await pgClient.connect();
      const escapedDatabaseName = dbName.replace(/"/g, '""');

      if (action === "CREATE") {
        try {
          await pgClient.query(`DROP DATABASE "${escapedDatabaseName}"`); // ensure drop
        } catch (_error) {
          // silent db does not exist
        }
      }

      const sql = `${action} DATABASE "${escapedDatabaseName}"`;
      const result = await pgClient.query(sql);
      return result;
    } catch (err) {
      // wrap errors
      if (isPgtoolsError(err)) {
        throw new PgtoolsError(err);
      }
      throw err;
    } finally {
      if (!openedClient) pgClient.end();
    }
  };
}

export const createdb = createFunction("CREATE");
export const dropdb = createFunction("DROP");
