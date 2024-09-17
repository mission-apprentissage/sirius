const cli = require("commander").program;
const { writeFileSync } = require("fs");

const createComponents = require("./components");
const httpServer = require("./httpServer");
const { migrateDownDB, migrateToLatest } = require("./migrations/migrate");
const classifyVerbatims = require("./db/classifyVerbatims");
const extractThemesVerbatims = require("./db/extractThemesVerbatims");

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

cli.command("migrateDB").action(async () => {
  await migrateToLatest();
});

cli
  .command("classify-verbatims")
  .description("Classifie les verbatims exitants")
  .action(async () => await classifyVerbatims());

cli
  .command("extract-themes-verbatims")
  .description("Extrait les thèmes des verbatims exitants")
  .action(async () => await extractThemesVerbatims());

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
