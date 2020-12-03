const { program: cli } = require("commander");
const runScript = require("../core/runScript");
const buildDecaCollection = require("./buildDecaCollection");

cli
  .command("import <decaDir>")
  .description("Importe la base DECA")
  .action((decaDir) => {
    runScript(({ db }) => buildDecaCollection(db, decaDir));
  });

cli.parse(process.argv);
