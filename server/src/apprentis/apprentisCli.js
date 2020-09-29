const { program: cli } = require("commander");
const { createReadStream } = require("fs");
const runScript = require("../core/runScript");
const importContrats = require("./mfr/importContrats");
const updateContrats = require("./mfr/updateContrats");

let mfr = cli.command("mfr").description("Gestion des apprentis provenant des fichiers MFR");
mfr
  .command("import [csvFile]")
  .description("Importe le fichier CSV dans la base")
  .action((csvFile) => {
    let inputStream = csvFile ? createReadStream(csvFile) : process.stdin;
    runScript(({ db, logger }) => importContrats(db, logger, inputStream));
  });

mfr
  .command("update [csvFile]")
  .description("Met à jour les contrats en base à partir du fichier")
  .action((csvFile) => {
    runScript(({ db, logger }) => {
      let inputStream = csvFile ? createReadStream(csvFile) : process.stdin;
      return updateContrats(db, logger, inputStream);
    });
  });

cli.parse(process.argv);
