const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const injectData = require("./dataset/injectData");
const createIndexes = require("./indexes/createIndexes");
const dropIndexes = require("./indexes/dropIndexes");
const capLogs = require("./indexes/capLogs");
const fixCreationDate = require("./migration/fixCreationDate");

cli
  .command("dataset")
  .description("Injecte un jeu de données dans la base")
  .action(() => {
    runScript(({ db }) => injectData(db));
  });

cli
  .command("indexes")
  .option("--drop", "Supprime les indexes existant")
  .description("Crée tous les indexes en base")
  .action((options) => {
    runScript(async ({ db, logger }) => {
      if (options.drop) {
        logger.info("Dropping indexes...");
        await dropIndexes(db);
      }

      logger.info("Creating indexes...");
      await createIndexes(db);
      await capLogs(db);
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

cli.parse(process.argv);
