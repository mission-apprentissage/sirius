const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const reconciliateWithCatalogue = require("./reconciliateWithCatalogue");
const buildDecaCollection = require("./deca/buildDecaCollection");

cli
  .command("reconciliate")
  .description("Permet de tester la réconciliation")
  .action(async () => {
    runScript(({ db, logger, httpClient }) => {
      return reconciliateWithCatalogue(db, logger, httpClient);
    });
  });

let deca = cli.command("deca").description("Gestion des apprentis provenant des fichiers MFR");

deca
  .command("import <decaDir>")
  .description("Importe la base DECA")
  .action((decaDir) => {
    runScript(({ db }) => buildDecaCollection(db, decaDir));
  });

cli.parse(process.argv);
