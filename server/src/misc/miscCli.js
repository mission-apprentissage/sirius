const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const reconciliateWithCatalogue = require("./reconciliateWithCatalogue");
const computeCfaScore = require("./computeCfaScore");

cli
  .command("reconciliate")
  .description("Permet de tester la réconciliation")
  .action(async () => {
    runScript(({ db, logger, httpClient }) => {
      return reconciliateWithCatalogue(db, logger, httpClient);
    });
  });

cli
  .command("score [outputFile]")
  .description("Permet de tester le calcul du score des cfa")
  .action(async (outputFile) => {
    runScript(({ db }) => {
      return computeCfaScore(db, outputFile);
    });
  });

cli.parse(process.argv);
