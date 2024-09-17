/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

import * as migration_1721809671508 from "./migration_1721809671508";
import * as migration_1721827964729 from "./migration_1721827964729";

type Migration = {
  up: (db: Kysely<any>) => Promise<void>;
  down: (db: Kysely<any>) => Promise<void>;
};

type Migrations = Record<string, Migration>;

export const migrations: Migrations = {
  migration_1721809671508,
  migration_1721827964729,
};
