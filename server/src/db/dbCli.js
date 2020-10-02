const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const injectData = require("./dataset/injectData");
const convertContratsIntoApprenti = require("./migration/convertContratsIntoApprenti");
const removeInvalidCharacters = require("./migration/removeInvalidCharacters");

cli
  .command("migrate")
  .description("Migre les données en base")
  .action(() => {
    runScript(async ({ db }) => {
      return {
        convertContratsIntoApprenti: await convertContratsIntoApprenti(db),
        removeInvalidCharacters: await removeInvalidCharacters(db),
      };
    });
  });

cli
  .command("dataset")
  .description("Injecte un jeu de données dans la base")
  .action(() => {
    runScript(({ db, questionnaires }) => injectData(db, questionnaires));
  });

cli.parse(process.argv);
