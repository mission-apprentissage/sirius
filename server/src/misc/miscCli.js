const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const reconciliateWithCatalogue = require("./reconciliateWithCatalogue");

cli
  .command("reconciliate")
  .description("Permet de tester la réconciliation")
  .action(async () => {
    runScript(({ db, logger, httpClient }) => {
      return reconciliateWithCatalogue(db, logger, httpClient);
    });
  });

cli.parse(process.argv);
