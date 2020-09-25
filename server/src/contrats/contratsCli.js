const { program: cli } = require("commander");
const { createReadStream } = require("fs");
const runScript = require("../core/runScript");
const importContrats = require("./sources/mfr/importContrats");
const updateContrats = require("./sources/mfr/updateContrats");
const reconciliateWithCatalogue = require("./reconciliation/reconciliateWithCatalogue");

cli
  .command("import [csvFile]")
  .description("Importe le fichier CSV dans la base")
  .action((csvFile) => {
    let inputStream = csvFile ? createReadStream(csvFile) : process.stdin;
    runScript(({ db, logger }) => importContrats(db, logger, inputStream));
  });

cli
  .command("update [csvFile]")
  .description("Met à jour les contrats en base à partir du fichier")
  .action((csvFile) => {
    runScript(({ db, logger }) => {
      let inputStream = csvFile ? createReadStream(csvFile) : process.stdin;
      return updateContrats(db, logger, inputStream);
    });
  });

cli
  .command("reconciliate")
  .description("Réconcilie les contrats avec la base catalogue")
  .action(() => {
    runScript(({ db, logger, httpClient }) => reconciliateWithCatalogue(db, logger, httpClient));
  });

cli.parse(process.argv);
