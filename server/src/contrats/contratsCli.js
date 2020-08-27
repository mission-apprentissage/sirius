const { program: cli } = require("commander");
const { createReadStream } = require("fs");
const importContrats = require("./csv/cfa/importContrats");
const updateContrats = require("./csv/cfa/updateContrats");
const runScript = require("../core/runScript");

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

cli.parse(process.argv);
