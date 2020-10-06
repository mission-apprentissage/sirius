const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const injectData = require("./dataset/injectData");
const convertContratsIntoApprenti = require("./migration/convertContratsIntoApprenti");
const removeInvalidCharacters = require("./migration/removeInvalidCharacters");
const renameSentDate = require("./migration/renameSentDate");
const reworkQuestionnaires = require("./migration/reworkQuestionnaires");

cli
  .command("migrate")
  .description("Migre les données en base")
  .action(() => {
    runScript(async ({ db }) => {
      return {
        reworkQuestionnaires: await reworkQuestionnaires(db),
        convertContratsIntoApprenti: await convertContratsIntoApprenti(db),
        removeInvalidCharacters: await removeInvalidCharacters(db),
        renameSentDate: await renameSentDate(db),
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
