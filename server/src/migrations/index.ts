/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Kysely } from "kysely";

import * as migration_1721809671508 from "./migration_1721809671508";
import * as migration_1727788480067 from "./migration_1727788480067";

type Migration = {
  up: (db: Kysely<any>) => Promise<void>;
  down: (db: Kysely<any>) => Promise<void>;
};

type Migrations = Record<string, Migration>;

export const migrations: Migrations = {
  migration_1721809671508,
  migration_1727788480067,
};
