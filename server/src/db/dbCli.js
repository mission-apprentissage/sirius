const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const injectData = require("./dataset/injectData");
const createIndexes = require("./indexes/createIndexes");
const dropIndexes = require("./indexes/dropIndexes");
const capLogs = require("./indexes/capLogs");
const fixCreationDate = require("./migration/fixCreationDate");

let indexes = cli.command("indexes").description("Gestion des indexes");
indexes
  .command("create")
  .description("Crée tous les indexes en base")
  .action(() => {
    runScript(async ({ db, logger }) => {
      logger.info("Creating indexes...");
      await createIndexes(db);
      await capLogs(db);
    });
  });
indexes
  .command("drop")
  .description("Supprime tous les indexes en base")
  .action(() => {
    runScript(async ({ db, logger }) => {
      logger.info("Dropping indexes...");
      await dropIndexes(db);
    });
  });

cli
  .command("migrate")
  .description("Migre les données en base")
  .action(() => {
    runScript(async ({ db }) => {
      return {
        fixCreationDate: await fixCreationDate(db),
      };
    });
  });

cli
  .command("dataset")
  .description("Injecte un jeu de données dans la base")
  .action(() => {
    runScript(({ db }) => injectData(db));
  });

cli.parse(process.argv);
