const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const computeCfaScore = require("./computeCfaScore");

cli
  .command("score [outputFile]")
  .description("Permet de tester le calcul du score des cfa")
  .action(async (outputFile) => {
    runScript(({ db }) => {
      return computeCfaScore(db, outputFile);
    });
  });

cli.parse(process.argv);
