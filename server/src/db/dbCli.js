const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const injectData = require("./dataset/injectData");

cli
  .command("migrate")
  .description("Migre les données en base")
  .action(() => {
    runScript(async ({ db }) => {
      return {

      };
    });
  });

cli
  .command("dataset")
  .description("Injecte un jeu de données dans la base")
  .action(() => {
    runScript(({ db, apprentis }) => injectData(db, apprentis));
  });

cli.parse(process.argv);
