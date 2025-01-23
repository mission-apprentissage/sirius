/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Kysely } from "kysely";

import * as migration_1721809671508 from "./migration_1721809671508";
import * as migration_1727788480067 from "./migration_1727788480067";
import * as migration_1731512210632 from "./migration_1731512210632";
import * as migration_1732026279850 from "./migration_1732026279850";
import * as migration_1732095200522 from "./migration_1732095200522";
import * as migration_1734429935499 from "./migration_1734429935499";
import * as migration_1737452387530 from "./migration_1737452387530";

type Migration = {
  up: (db: Kysely<any>) => Promise<void>;
  down: (db: Kysely<any>) => Promise<void>;
};

type Migrations = Record<string, Migration>;

export const migrations: Migrations = {
  migration_1721809671508,
  migration_1727788480067,
  migration_1731512210632,
  migration_1732026279850,
  migration_1732095200522,
  migration_1734429935499,
  migration_1737452387530,
};
