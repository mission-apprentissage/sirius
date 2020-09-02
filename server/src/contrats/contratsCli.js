const { program: cli } = require("commander");
const { createReadStream } = require("fs");
const runScript = require("../core/runScript");
const importContrats = require("./csv/cfa/importContrats");
const updateContrats = require("./csv/cfa/updateContrats");
const reconciliateWithCatalogue = require("./reconciliation/reconciliateWithCatalogue");

cli
  .command("import <csvFile>")
  .description("Importe le fichier CSV dans la base")
  .action((csvFile) => {
    runScript(({ db, logger }) => importContrats(db, logger, createReadStream(csvFile)));
  });

cli
  .command("update <csvFile>")
  .description("Met à jour les contrats en base à partir du fichier")
  .action((csvFile) => {
    runScript(({ db, logger }) => updateContrats(db, logger, createReadStream(csvFile)));
  });

cli
  .command("reconciliate")
  .description("Réconcilie les contrats avec la base catalogue")
  .action(() => {
    runScript(({ db, logger }) => reconciliateWithCatalogue(db, logger));
  });

cli.parse(process.argv);
