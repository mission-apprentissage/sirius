const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const migrateDb = require("./migrateDb");
const injectData = require("./injectData");

cli
  .command("migrate")
  .description("Migre les données en base")
  .action(() => {
    runScript(async ({ db }) => migrateDb(db));
  });

cli
  .command("dataset")
  .description("Injecte un jeu de données dans la base")
  .action(() => {
    runScript(({ db, apprentis }) => injectData(db, apprentis));
  });

cli.parse(process.argv);
