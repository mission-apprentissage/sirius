const { program: cli } = require("commander");
const { createReadStream } = require("fs");
const runScript = require("../core/runScript");
const importContrats = require("./importContrats");
const updateContrats = require("./updateContrats");

cli
  .command("import [csvFile]")
  .description("Importe le fichier CSV dans la base")
  .action((csvFile) => {
    let inputStream = csvFile ? createReadStream(csvFile) : process.stdin;
    runScript(({ logger, apprentis }) => importContrats(logger, apprentis, inputStream));
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

cli.parse(process.argv);
