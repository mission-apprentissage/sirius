const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const injectData = require("./dataset/injectData");
const addThematiqueToQuestions = require("./migration/addThematiqueToQuestions");
const addMissingSatisfaction = require("./migration/addMissingSatisfaction");

cli
  .command("migrate")
  .description("Migre les données en base")
  .action(() => {
    runScript(async ({ db }) => {
      return {
        addThematiqueToQuestions: await addThematiqueToQuestions(db),
        addMissingSatisfaction: await addMissingSatisfaction(db),
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
