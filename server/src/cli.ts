import { program as cli } from "commander";
import { writeFileSync } from "fs";

import createComponents from "./components";
import httpServer from "./httpServer";
import { migrateDownDB, migrateToLatest } from "./migrations/migrate";

process.on("unhandledRejection", (e) => console.log("An unexpected error occurred", e));
process.on("uncaughtException", (e) => console.log("An unexpected error occurred", e));

cli
  .command("http")
  .description("Démarre le server http")
  .action(async () => {
    const components = await createComponents();

    const server = await httpServer(components);
    server.listen(5000, () => components.logger.info(`Server ready and listening on port ${5000}`));
  });

cli.command("db", "Manipulation de la base de données", {
  executableFile: "db/dbCli",
});

cli.command("migrateDB").action(async () => {
  await migrateToLatest();
});

cli
  .command("migrateDownDB")
  .argument("[numberOfMigrations]", "number of migrations to rollback [default: 1]")
  .action(async (numberOfMigrations = 1) => {
    await migrateDownDB(numberOfMigrations);
  });

cli.command("create-migration").action(() =>
  writeFileSync(
    `${__dirname}/migrations/migration_${new Date().getTime()}.ts`,
    `import { Kysely } from "kysely";

     export const up = async (db: Kysely<unknown>) => {};

     export const down = async (db: Kysely<unknown>) => {};
    `
  )
);

cli.parse(process.argv);
