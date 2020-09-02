const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const testCatalogue = require("./testCatalogue");

cli
  .command("test")
  .description("Test la réconciliation avec le catalogue")
  .action(() => {
    runScript(({ db, logger }) => {
      return testCatalogue(db, logger);
    });
  });

cli.parse(process.argv);
